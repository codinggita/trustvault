const express = require('express');

const { fundAccount } = require('../controllers/admin');
const { protect } = require('../middleware/auth');
const systemUserOnly = require('../middleware/systemUser');
const { fundAccountValidator } = require('../validators/transactionValidator');

const router = express.Router();

router.use(protect, systemUserOnly);
router.post('/fund-account', fundAccountValidator, fundAccount);

module.exports = router;
