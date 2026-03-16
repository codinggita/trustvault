const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Account = require('../models/Account');
const Ledger = require('../models/Ledger');
const Transaction = require('../models/Transaction');
const { sendTransferEmail } = require('../services/emailService');
const { executeTransfer } = require('../services/ledgerService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const findAccountByReference = require('../utils/findAccountByReference');

const validationGuard = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array().map((item) => item.msg));
  }
};

const getUserAccounts = async (userId) => Account.find({ userId }).select('_id accountNumber status');

const mapTransactionForUser = (transaction, accounts) => {
  const accountIds = new Set(accounts.map((item) => String(item._id || item)));
  const type = accountIds.has(String(transaction.fromAccount?._id || transaction.fromAccount))
    ? 'DEBIT'
    : 'CREDIT';

  return {
    id: transaction._id,
    amount: transaction.amount,
    status: transaction.status,
    description: transaction.description,
    referenceId: transaction.idempotencyKey,
    type,
    createdAt: transaction.createdAt,
    fromAccount: transaction.fromAccount,
    toAccount: transaction.toAccount,
  };
};

const transfer = asyncHandler(async (req, res) => {
  validationGuard(req);

  const { toAccount, fromAccountId, amount, description, idempotencyKey } = req.body;
  const userAccounts = await getUserAccounts(req.user._id);

  if (!userAccounts.length) {
    throw new AppError('No source account is available for this user', 400);
  }

  const senderAccount =
    (fromAccountId && userAccounts.find((account) => String(account._id) === String(fromAccountId))) ||
    userAccounts[0];

  if (!senderAccount) {
    throw new AppError('The selected source account is not available to this user', 404);
  }

  const recipientAccount = await findAccountByReference(toAccount);
  if (!recipientAccount) {
    throw new AppError('Recipient account could not be found', 404);
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      result = await executeTransfer({
        fromAccountId: senderAccount._id,
        toAccountId: recipientAccount._id,
        amount,
        description,
        idempotencyKey,
        session,
      });
    });
  } finally {
    session.endSession();
  }

  Promise.allSettled([
    sendTransferEmail({
      email: result.senderAccount.userId.email,
      name: result.senderAccount.userId.name,
      amount: result.transaction.amount,
      date: result.transaction.createdAt,
      referenceId: result.transaction.idempotencyKey,
      direction: 'DEBIT',
      counterpartyAccountNumber: result.receiverAccount.accountNumber,
      description: result.transaction.description,
    }),
    sendTransferEmail({
      email: result.receiverAccount.userId.email,
      name: result.receiverAccount.userId.name,
      amount: result.transaction.amount,
      date: result.transaction.createdAt,
      referenceId: result.transaction.idempotencyKey,
      direction: 'CREDIT',
      counterpartyAccountNumber: result.senderAccount.accountNumber,
      description: result.transaction.description,
    }),
  ]).catch((error) => {
    console.error('Transfer email dispatch failed:', error);
  });

  return res.status(201).json({
    success: true,
    message: 'Transfer completed successfully',
    data: {
      transaction: {
        id: result.transaction._id,
        amount: result.transaction.amount,
        status: result.transaction.status,
        description: result.transaction.description,
        referenceId: result.transaction.idempotencyKey,
        createdAt: result.transaction.createdAt,
      },
      senderBalanceAfter: result.senderBalanceAfter,
      receiverAccountNumber: result.receiverAccount.accountNumber,
    },
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  validationGuard(req);

  const userAccounts = await getUserAccounts(req.user._id);
  const accountIds = userAccounts.map((account) => account._id);

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.type === 'DEBIT') {
    query.fromAccount = { $in: accountIds };
  } else if (req.query.type === 'CREDIT') {
    query.toAccount = { $in: accountIds };
  } else {
    query.$or = [{ fromAccount: { $in: accountIds } }, { toAccount: { $in: accountIds } }];
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.dateFrom || req.query.dateTo) {
    query.createdAt = {};
    if (req.query.dateFrom) {
      query.createdAt.$gte = new Date(req.query.dateFrom);
    }
    if (req.query.dateTo) {
      const inclusiveEnd = new Date(req.query.dateTo);
      inclusiveEnd.setHours(23, 59, 59, 999);
      query.createdAt.$lte = inclusiveEnd;
    }
  }

  if (req.query.search) {
    query.$and = [
      ...(query.$and || []),
      {
        $or: [
          { idempotencyKey: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } },
        ],
      },
    ];
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate('fromAccount', 'accountNumber')
      .populate('toAccount', 'accountNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Transaction.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      items: transactions.map((transaction) => mapTransactionForUser(transaction, userAccounts)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId)
    .populate('fromAccount', 'accountNumber userId')
    .populate('toAccount', 'accountNumber userId');

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  const userAccounts = await getUserAccounts(req.user._id);
  const accountIds = new Set(userAccounts.map((account) => String(account._id)));

  const authorized =
    accountIds.has(String(transaction.fromAccount?._id || transaction.fromAccount)) ||
    accountIds.has(String(transaction.toAccount?._id || transaction.toAccount)) ||
    req.user.isSystemUser;

  if (!authorized) {
    throw new AppError('You do not have access to this transaction', 403);
  }

  const ledgerEntries = await Ledger.find({ transactionId: transaction._id }).sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    data: {
      ...mapTransactionForUser(transaction, userAccounts),
      ledgerEntries,
    },
  });
});

module.exports = {
  transfer,
  getTransactions,
  getTransactionById,
};

