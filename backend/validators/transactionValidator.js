const { body, query } = require('express-validator');

const transferValidator = [
  body('toAccount').trim().notEmpty().withMessage('Recipient account number is required'),
  body('fromAccountId').optional().isMongoId().withMessage('Invalid source account'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('idempotencyKey').isUUID().withMessage('A valid idempotency key is required'),
  body('description').optional().trim().isLength({ max: 280 }).withMessage('Description is too long'),
];

const fundAccountValidator = [
  body('accountId').optional().isMongoId().withMessage('Account ID must be valid'),
  body('accountNumber').optional().trim().isLength({ min: 12, max: 12 }).withMessage('Account number must be 12 digits'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('description').optional().trim().isLength({ max: 280 }).withMessage('Description is too long'),
];

const accountStatusValidator = [
  body('status').isIn(['ACTIVE', 'FROZEN', 'CLOSED']).withMessage('Status must be ACTIVE, FROZEN, or CLOSED'),
];

const transactionQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('type').optional().isIn(['DEBIT', 'CREDIT']).withMessage('Type must be DEBIT or CREDIT'),
  query('status').optional().isIn(['PENDING', 'COMPLETED', 'FAILED']).withMessage('Invalid status filter'),
];

module.exports = {
  transferValidator,
  fundAccountValidator,
  accountStatusValidator,
  transactionQueryValidator,
};
