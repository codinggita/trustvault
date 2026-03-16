const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Account = require('../models/Account');
const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');
const { sendTransferEmail, sendWelcomeEmail } = require('../services/emailService');
const { calculateBalance, executeTransfer } = require('../services/ledgerService');
const { generateUniqueAccountNumber, getSystemAccount } = require('../services/systemService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const getCookieOptions = require('../utils/cookieOptions');
const generateIdempotencyKey = require('../utils/generateIdempotencyKey');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '3d',
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isSystemUser: user.isSystemUser,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const attachAuthCookie = (res, userId) => {
  const token = signToken(userId);
  res.cookie('trustvault_token', token, getCookieOptions());
  return token;
};

const validationGuard = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400, errors.array().map((item) => item.msg));
  }
};

const register = asyncHandler(async (req, res) => {
  validationGuard(req);

  const { name, email, password } = req.body;
  const session = await mongoose.startSession();
  let createdUser;
  let createdAccount;
  let fundingResult;

  try {
    await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email }).session(session);
      if (existingUser) {
        throw new AppError('An account already exists for this email address', 409);
      }

      [createdUser] = await User.create(
        [
          {
            name,
            email,
            password,
          },
        ],
        { session, ordered: true }
      );

      const accountNumber = await generateUniqueAccountNumber(session);
      [createdAccount] = await Account.create(
        [
          {
            userId: createdUser._id,
            accountNumber,
          },
        ],
        { session, ordered: true }
      );

      const systemAccount = await getSystemAccount(session);
      if (!systemAccount) {
        throw new AppError('System account is not configured. Run the seed script first.', 500);
      }

      fundingResult = await executeTransfer({
        fromAccountId: systemAccount._id,
        toAccountId: createdAccount._id,
        amount: 10000,
        description: 'TrustVault welcome credit',
        idempotencyKey: generateIdempotencyKey(),
        session,
      });
    });
  } finally {
    session.endSession();
  }

  attachAuthCookie(res, createdUser._id);

  Promise.allSettled([
    sendWelcomeEmail({
      email: createdUser.email,
      name: createdUser.name,
      accountNumber: createdAccount.accountNumber,
    }),
    sendTransferEmail({
      email: createdUser.email,
      name: createdUser.name,
      amount: fundingResult.transaction.amount,
      date: fundingResult.transaction.createdAt,
      referenceId: fundingResult.transaction.idempotencyKey,
      direction: 'CREDIT',
      counterpartyAccountNumber: fundingResult.senderAccount.accountNumber,
      description: fundingResult.transaction.description,
    }),
  ]).catch((error) => {
    console.error('Email dispatch failed after registration:', error);
  });

  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: sanitizeUser(createdUser),
      account: {
        ...createdAccount.toObject(),
        balance: fundingResult.receiverBalanceAfter,
      },
    },
  });
});

const login = asyncHandler(async (req, res) => {
  validationGuard(req);

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const accounts = await Account.find({ userId: user._id }).sort({ createdAt: -1 });
  const accountPayload = await Promise.all(
    accounts.map(async (account) => ({
      ...account.toObject(),
      balance: await calculateBalance(account._id),
    }))
  );

  attachAuthCookie(res, user._id);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizeUser(user),
      accounts: accountPayload,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.trustvault_token;

  if (token) {
    const decoded = jwt.decode(token);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 86400000);
    await BlacklistedToken.findOneAndUpdate(
      { token },
      { token, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  res.clearCookie('trustvault_token', getCookieOptions());

  return res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

const me = asyncHandler(async (req, res) => {
  const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
  const accountPayload = await Promise.all(
    accounts.map(async (account) => ({
      ...account.toObject(),
      balance: await calculateBalance(account._id),
    }))
  );

  return res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
      accounts: accountPayload,
    },
  });
});

module.exports = {
  register,
  login,
  logout,
  me,
};
