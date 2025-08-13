const router = require('express').Router();
const { ceateExpenses, getAllExpenses, deleteExpense, updateExpense } = require('../controller/expenses');

router.post('/create', ceateExpenses);
router.get('/', getAllExpenses);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;