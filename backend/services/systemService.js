const mongoose = require('mongoose');

const Account = require('../models/Account');
const Ledger = require('../models/Ledger');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const generateAccountNumber = require('../utils/generateAccountNumber');
const generateIdempotencyKey = require('../utils/generateIdempotencyKey');
const { calculateBalance } = require('./ledgerService');

const getSystemProfile = () => ({
  name: 'TrustVault Treasury',
  email: process.env.SYSTEM_USER_EMAIL || 'admin@trustvault.com',
  password: process.env.SYSTEM_USER_PASSWORD,
});

const STARTING_BALANCE = 100000000;

const generateUniqueAccountNumber = async (session) => {
  let accountNumber;
  let exists = true;

  while (exists) {
    accountNumber = generateAccountNumber();
    exists = await Account.exists({ accountNumber }).session(session);
  }

  return accountNumber;
};

const seedSystemBalance = async (accountId, session) => {
  const [transaction] = await Transaction.create(
    [
      {
        fromAccount: null,
        toAccount: accountId,
        amount: STARTING_BALANCE,
        idempotencyKey: generateIdempotencyKey(),
        status: 'COMPLETED',
        description: 'Initial TrustVault treasury funding',
      },
    ],
    { session, ordered: true }
  );

  await Ledger.create(
    [
      {
        accountId,
        transactionId: transaction._id,
        amount: STARTING_BALANCE,
        type: 'CREDIT',
        balanceAfter: STARTING_BALANCE,
      },
    ],
    { session, ordered: true }
  );
};

const getSystemAccount = async (session) => {
  let systemAccount = null;

  if (process.env.SYSTEM_ACCOUNT_ID && mongoose.isValidObjectId(process.env.SYSTEM_ACCOUNT_ID)) {
    systemAccount = await Account.findById(process.env.SYSTEM_ACCOUNT_ID).session(session);
  }

  if (!systemAccount) {
    const systemUser = await User.findOne({ isSystemUser: true }).session(session);
    if (systemUser) {
      systemAccount = await Account.findOne({ userId: systemUser._id }).session(session);
    }
  }

  if (systemAccount) {
    process.env.SYSTEM_ACCOUNT_ID = systemAccount._id.toString();
  }

  return systemAccount;
};

const ensureSystemAccount = async () => {
  const session = await mongoose.startSession();
  const systemProfile = getSystemProfile();
  let systemUser;
  let systemAccount;

  try {
    await session.withTransaction(async () => {
      systemUser =
        (await User.findOne({ email: systemProfile.email }).session(session)) ||
        (await User.findOne({ isSystemUser: true }).session(session));

      if (!systemUser) {
        if (!systemProfile.password) {
          throw new Error('SYSTEM_USER_PASSWORD is required before creating the system user.');
        }

        [systemUser] = await User.create(
          [
            {
              ...systemProfile,
              isSystemUser: true,
            },
          ],
          { session, ordered: true }
        );
      }

      if (process.env.SYSTEM_ACCOUNT_ID && mongoose.isValidObjectId(process.env.SYSTEM_ACCOUNT_ID)) {
        systemAccount = await Account.findById(process.env.SYSTEM_ACCOUNT_ID).session(session);
      }

      if (!systemAccount) {
        systemAccount = await Account.findOne({ userId: systemUser._id }).session(session);
      }

      if (!systemAccount) {
        const accountNumber = await generateUniqueAccountNumber(session);
        [systemAccount] = await Account.create(
          [
            {
              userId: systemUser._id,
              accountNumber,
              status: 'ACTIVE',
            },
          ],
          { session, ordered: true }
        );
      }

      const balance = await calculateBalance(systemAccount._id, session);
      if (balance <= 0) {
        await seedSystemBalance(systemAccount._id, session);
      }
    });
  } finally {
    session.endSession();
  }

  process.env.SYSTEM_ACCOUNT_ID = systemAccount._id.toString();

  return {
    systemUser,
    systemAccount,
  };
};

module.exports = {
  ensureSystemAccount,
  generateUniqueAccountNumber,
  getSystemAccount,
  getSystemProfile,
};
