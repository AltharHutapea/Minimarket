const express = require('express');
const router = express.Router();
const { showTransactions, showCreateTransaction, createTransaction, showDetailTransaction, printTransaction } = require('../controllers/transactionController');
const { isAuthenticated } = require('../middleware/auth');

router.use(isAuthenticated);
router.get('/', showTransactions);
router.get('/create', showCreateTransaction);
router.post('/create', createTransaction);
router.get('/:id', showDetailTransaction);
router.get('/:id/print', printTransaction);

module.exports = router;