const AppError = require('../utils/AppError');

const systemUserOnly = (req, _res, next) => {
  if (!req.user?.isSystemUser) {
    return next(new AppError('System user access is required', 403));
  }

  return next();
};

module.exports = systemUserOnly;

