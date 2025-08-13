const prisma = require("../DB/prismaClient");

const ceateExpenses = async (req, res) => {
    const { amount, description } = req.body;
    try {
        const expense = await prisma.expenses.create({
            data: { amount, description },
        });
        res.status(201).json({ expense, message: "Expense created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expenses.findMany({});
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
const deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await prisma.expenses.delete({
            where: { id },
        });
        res.json({ message: "Expense deleted successfully", expense });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};
const updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description } = req.body;
    try {
        const expense = await prisma.expenses.update({
            where: { id },
            data: { amount, description },
        });
        res.json({expense, message : "Expenses updated successfully"});
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { ceateExpenses, getAllExpenses, deleteExpense, updateExpense };