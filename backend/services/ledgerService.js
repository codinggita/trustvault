const mongoose = require('mongoose');

const Account = require('../models/Account');
const Ledger = require('../models/Ledger');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/AppError');

const calculateBalance = async (accountId, session) => {
  const objectId =
    typeof accountId === 'string' ? new mongoose.Types.ObjectId(accountId) : accountId;

  const aggregate = Ledger.aggregate([
    {
      $match: {
        accountId: objectId,
      },
    },
    {
      $group: {
        _id: '$accountId',
        balance: {
          $sum: {
            $cond: [
              {
                $eq: ['$type', 'CREDIT'],
              },
              '$amount',
              {
                $multiply: ['$amount', -1],
              },
            ],
          },
        },
      },
    },
  ]);

  if (session) {
    aggregate.session(session);
  }

  const [summary] = await aggregate;
  return Number(summary?.balance || 0);
};

const executeTransfer = async ({
  fromAccountId,
  toAccountId,
  amount,
  description = '',
  idempotencyKey,
  session,
}) => {
  const normalizedAmount = Number(Number(amount).toFixed(2));

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    throw new AppError('Transfer amount must be greater than zero', 400);
  }

  if (String(fromAccountId) === String(toAccountId)) {
    throw new AppError('Transfers to the same account are not allowed', 400);
  }

  const existingTransaction = await Transaction.findOne({ idempotencyKey }).session(session);
  if (existingTransaction) {
    throw new AppError('This idempotency key has already been used', 409);
  }

  const [senderAccount, receiverAccount] = await Promise.all([
    Account.findById(fromAccountId).populate('userId', 'name email isSystemUser').session(session),
    Account.findById(toAccountId).populate('userId', 'name email isSystemUser').session(session),
  ]);

  if (!senderAccount || !receiverAccount) {
    throw new AppError('One or more accounts could not be found', 404);
  }

  if (senderAccount.status !== 'ACTIVE') {
    throw new AppError('Sender account must be active', 400);
  }

  if (receiverAccount.status !== 'ACTIVE') {
    throw new AppError('Receiver account must be active', 400);
  }

  const senderBalanceBefore = await calculateBalance(senderAccount._id, session);
  if (senderBalanceBefore < normalizedAmount) {
    throw new AppError('Insufficient funds for this transfer', 400);
  }

  const receiverBalanceBefore = await calculateBalance(receiverAccount._id, session);

  const [transaction] = await Transaction.create(
    [
      {
        fromAccount: senderAccount._id,
        toAccount: receiverAccount._id,
        amount: normalizedAmount,
        idempotencyKey,
        status: 'PENDING',
        description,
      },
    ],
    { session, ordered: true }
  );

  const senderBalanceAfter = Number((senderBalanceBefore - normalizedAmount).toFixed(2));
  const receiverBalanceAfter = Number((receiverBalanceBefore + normalizedAmount).toFixed(2));

  await Ledger.create(
    [
      {
        accountId: senderAccount._id,
        transactionId: transaction._id,
        amount: normalizedAmount,
        type: 'DEBIT',
        balanceAfter: senderBalanceAfter,
      },
      {
        accountId: receiverAccount._id,
        transactionId: transaction._id,
        amount: normalizedAmount,
        type: 'CREDIT',
        balanceAfter: receiverBalanceAfter,
      },
    ],
    { session, ordered: true }
  );

  transaction.status = 'COMPLETED';
  await transaction.save({ session });

  return {
    transaction,
    senderAccount,
    receiverAccount,
    senderBalanceBefore,
    senderBalanceAfter,
    receiverBalanceBefore,
    receiverBalanceAfter,
  };
};

module.exports = {
  calculateBalance,
  executeTransfer,
};
