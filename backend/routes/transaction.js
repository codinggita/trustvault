const express = require('express');

const { getTransactionById, getTransactions, transfer } = require('../controllers/transaction');
const { protect } = require('../middleware/auth');
const { transactionQueryValidator, transferValidator } = require('../validators/transactionValidator');

const router = express.Router();

router.use(protect);
router.post('/transfer', transferValidator, transfer);
router.get('/', transactionQueryValidator, getTransactions);
router.get('/:transactionId', getTransactionById);

module.exports = router;

