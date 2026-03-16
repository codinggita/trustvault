const express = require('express');

const { getAccountById, getAccounts, updateAccountStatus } = require('../controllers/account');
const { protect } = require('../middleware/auth');
const systemUserOnly = require('../middleware/systemUser');
const { accountStatusValidator } = require('../validators/transactionValidator');

const router = express.Router();

router.use(protect);
router.get('/', getAccounts);
router.get('/:accountId', getAccountById);
router.patch('/:accountId/status', systemUserOnly, accountStatusValidator, updateAccountStatus);

module.exports = router;

