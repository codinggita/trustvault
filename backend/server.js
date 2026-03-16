const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const transactionRoutes = require('./routes/transaction');
const { ensureSystemAccount } = require('./services/systemService');
const AppError = require('./utils/AppError');

dotenv.config();

const app = express();
const defaultFrontendOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => value.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultFrontendOrigins, ...configuredOrigins])];
const loopbackOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const isAllowedOrigin = (origin) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return true;
  }

  return process.env.NODE_ENV !== 'production' && loopbackOriginPattern.test(origin);
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, origin || allowedOrigins[0]);
      }

      return callback(new AppError(`Origin not allowed by CORS: ${origin}`, 403));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(globalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'TrustVault API is healthy',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

app.all('*', (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await ensureSystemAccount();

  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => {
    console.log(`TrustVault backend listening on port ${port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Unable to start TrustVault backend:', error);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
};
