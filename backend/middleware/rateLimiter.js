const rateLimit = require('express-rate-limit');

const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const localIps = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

const shouldSkipRateLimit = (req) => {
  if (req.method === 'OPTIONS') {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const origin = req.get('origin');
  return localIps.has(req.ip) || localOriginPattern.test(origin || '');
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipRateLimit,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait before trying again.',
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
};
