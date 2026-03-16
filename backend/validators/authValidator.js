const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 120 }),
  body('email').trim().normalizeEmail().isEmail().withMessage('A valid email address is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage('Password must contain at least one letter and one number'),
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match');
      }

      return true;
    }),
];

const loginValidator = [
  body('email').trim().normalizeEmail().isEmail().withMessage('A valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidator,
  loginValidator,
};

