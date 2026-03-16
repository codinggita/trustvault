const AppError = require('../utils/AppError');

const handleCastError = (error) =>
  new AppError(`Resource not found for identifier: ${error.value}`, 404);

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue || {})[0] || 'field';
  return new AppError(`${field} already exists`, 409);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors || {}).map((item) => item.message);
  return new AppError('Validation failed', 400, errors);
};

const handleJwtError = () => new AppError('Invalid authentication token', 401);
const handleJwtExpiredError = () => new AppError('Authentication token has expired', 401);

const errorHandler = (error, _req, res, _next) => {
  let formattedError = error;

  if (!(formattedError instanceof AppError)) {
    formattedError = Object.assign(
      new AppError(formattedError.message || 'Internal server error', formattedError.statusCode || 500),
      {
        isOperational: false,
        stack: formattedError.stack,
        name: formattedError.name,
        code: formattedError.code,
        errors: formattedError.errors,
        value: formattedError.value,
        keyValue: formattedError.keyValue,
      }
    );
  }

  if (formattedError.name === 'CastError') {
    formattedError = handleCastError(formattedError);
  }

  if (formattedError.code === 11000) {
    formattedError = handleDuplicateKeyError(formattedError);
  }

  if (formattedError.name === 'ValidationError') {
    formattedError = handleValidationError(formattedError);
  }

  if (formattedError.name === 'JsonWebTokenError') {
    formattedError = handleJwtError();
  }

  if (formattedError.name === 'TokenExpiredError') {
    formattedError = handleJwtExpiredError();
  }

  if (!formattedError.isOperational) {
    console.error(formattedError);
  }

  return res.status(formattedError.statusCode || 500).json({
    success: false,
    message: formattedError.message || 'Internal server error',
    ...(formattedError.errors?.length ? { errors: formattedError.errors } : {}),
  });
};

module.exports = errorHandler;

