const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const { sendTransferEmail } = require('../services/emailService');
const { executeTransfer } = require('../services/ledgerService');
const { getSystemAccount } = require('../services/systemService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const findAccountByReference = require('../utils/findAccountByReference');
const generateIdempotencyKey = require('../utils/generateIdempotencyKey');

const validationGuard = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array().map((item) => item.msg));
  }
};

const fundAccount = asyncHandler(async (req, res) => {
  validationGuard(req);

  const { accountId, accountNumber, amount, description } = req.body;
  const targetAccount = await findAccountByReference(accountId || accountNumber);
  if (!targetAccount) {
    throw new AppError('Target account could not be found', 404);
  }

  const systemAccount = await getSystemAccount();
  if (!systemAccount) {
    throw new AppError('System account is not configured', 500);
  }

  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      result = await executeTransfer({
        fromAccountId: systemAccount._id,
        toAccountId: targetAccount._id,
        amount,
        description: description || 'Administrative funding',
        idempotencyKey: generateIdempotencyKey(),
        session,
      });
    });
  } finally {
    session.endSession();
  }

  Promise.allSettled([
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
    console.error('Admin funding email dispatch failed:', error);
  });

  return res.status(201).json({
    success: true,
    message: 'Account funded successfully',
    data: {
      transaction: {
        id: result.transaction._id,
        referenceId: result.transaction.idempotencyKey,
        amount: result.transaction.amount,
        status: result.transaction.status,
      },
      fundedAccount: result.receiverAccount.accountNumber,
      balanceAfter: result.receiverBalanceAfter,
    },
  });
});

module.exports = {
  fundAccount,
};

