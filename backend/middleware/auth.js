const jwt = require('jsonwebtoken');

const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.trustvault_token;

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const blacklistedToken = await BlacklistedToken.findOne({ token });
  if (blacklistedToken) {
    throw new AppError('Session has expired. Please sign in again.', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new AppError('User associated with this token no longer exists', 401);
  }

  req.user = user;
  req.token = token;
  next();
});

module.exports = {
  protect,
};

