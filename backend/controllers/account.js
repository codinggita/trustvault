const { validationResult } = require('express-validator');

const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { calculateBalance } = require('../services/ledgerService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const validationGuard = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array().map((item) => item.msg));
  }
};

const buildTransactionView = (transaction, accountId) => {
  const isDebit = String(transaction.fromAccount?._id || transaction.fromAccount) === String(accountId);

  return {
    id: transaction._id,
    amount: transaction.amount,
    status: transaction.status,
    description: transaction.description,
    referenceId: transaction.idempotencyKey,
    type: isDebit ? 'DEBIT' : 'CREDIT',
    createdAt: transaction.createdAt,
    fromAccount: transaction.fromAccount,
    toAccount: transaction.toAccount,
  };
};

const getAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const payload = await Promise.all(
    accounts.map(async (account) => ({
      ...account.toObject(),
      balance: await calculateBalance(account._id),
    }))
  );

  return res.status(200).json({
    success: true,
    data: payload,
  });
});

const getAccountById = asyncHandler(async (req, res) => {
  const { accountId } = req.params;

  const account = await Account.findById(accountId).populate('userId', 'name email');
  if (!account) {
    throw new AppError('Account not found', 404);
  }

  const ownsAccount = String(account.userId._id) === String(req.user._id);
  if (!ownsAccount && !req.user.isSystemUser) {
    throw new AppError('You do not have access to this account', 403);
  }

  const [balance, recentTransactions] = await Promise.all([
    calculateBalance(account._id),
    Transaction.find({
      $or: [{ fromAccount: account._id }, { toAccount: account._id }],
    })
      .populate('fromAccount', 'accountNumber')
      .populate('toAccount', 'accountNumber')
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      ...account.toObject(),
      balance,
      recentTransactions: recentTransactions.map((transaction) =>
        buildTransactionView(transaction, account._id)
      ),
    },
  });
});

const updateAccountStatus = asyncHandler(async (req, res) => {
  validationGuard(req);

  const { accountId } = req.params;
  const { status } = req.body;

  const account = await Account.findById(accountId);
  if (!account) {
    throw new AppError('Account not found', 404);
  }

  if (String(account._id) === String(process.env.SYSTEM_ACCOUNT_ID) && status !== 'ACTIVE') {
    throw new AppError('The system treasury account cannot be frozen or closed', 400);
  }

  account.status = status;
  await account.save();

  return res.status(200).json({
    success: true,
    message: 'Account status updated successfully',
    data: {
      ...account.toObject(),
      balance: await calculateBalance(account._id),
    },
  });
});

module.exports = {
  getAccounts,
  getAccountById,
  updateAccountStatus,
};
