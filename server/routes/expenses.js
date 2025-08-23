const router = require('express').Router();
const { createExpenses, getAllExpenses, deleteExpense, updateExpense, getExpenseById } = require('../controller/expenses');

router.post('/create', createExpenses);
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;