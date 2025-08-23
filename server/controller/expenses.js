const prisma = require("../DB/prismaClient");

// Input validation helper
const validateExpenseInput = (amount, description) => {
    const errors = [];

    if (typeof amount !== "number" || amount <= 0) {
        errors.push("Amount must be a positive number");
    }

    if (!description || typeof description !== "string" || description.trim().length === 0) {
        errors.push("Description is required and must be a non-empty string");
    }

    if (description && description.length > 500) {
        errors.push("Description must be less than 500 characters");
    }

    return errors;  
};

// Create expense
const createExpenses = async (req, res) => {
    try {
        const { amount, description } = req.body;

        // Input validation
        const validationErrors = validateExpenseInput(amount, description);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: "Validation failed",
                details: validationErrors
            });
        }

        // Sanitize description
        const sanitizedDescription = description.trim();

        const expense = await prisma.expenses.create({
            data: {
                amount,
                description: sanitizedDescription
            },
        });

        res.status(201).json({
            success: true,
            expense,
            message: "Expense created successfully"
        });

    } catch (error) {
        console.error("Error creating expense:", error);
        res.status(500).json({
            error: "Internal server error",
            message: "Failed to create expense"
        });
    }
};

// Get all expenses with pagination and filtering
const getAllExpenses = async (req, res) => {
    try {
        const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Validate pagination parameters
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;

        // Validate sort parameters
        const validSortFields = ['createdAt', 'updatedAt', 'amount', 'description'];
        const validSortOrders = ['asc', 'desc'];

        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : 'desc';

        // Get expenses with pagination
        const [expenses, totalCount] = await Promise.all([
            prisma.expenses.findMany({
                orderBy: { [finalSortBy]: finalSortOrder },
                skip: offset,
                take: limitNum,
                select: {
                    id: true,
                    amount: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.expenses.count()
        ]);

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            success: true,
            expenses,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalCount,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });

    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({
            error: "Internal server error",
            message: "Failed to fetch expenses"
        });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid expense ID"
            });
        }

        // Check if expense exists before deleting
        const existingExpense = await prisma.expenses.findUnique({
            where: { id: id.trim() }
        });

        if (!existingExpense) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        const deletedExpense = await prisma.expenses.delete({
            where: { id: id.trim() }
        });

        res.json({
            success: true,
            message: "Expense deleted successfully",
            expense: deletedExpense
        });

    } catch (error) {
        console.error("Error deleting expense:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.status(500).json({
            error: "Internal server error",
            message: "Failed to delete expense"
        });
    }
};

// Update expense
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description } = req.body;

        // Validate ID format
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid expense ID"
            });
        }

        // Check if expense exists
        const existingExpense = await prisma.expenses.findUnique({
            where: { id: id.trim() }
        });

        if (!existingExpense) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        // Validate update data
        const updateData = {};
        let hasUpdates = false;

        if (amount !== undefined) {
            if (typeof amount !== "number" || amount <= 0) {
                return res.status(400).json({
                    error: "Amount must be a positive number"
                });
            }
            updateData.amount = amount;
            hasUpdates = true;
        }

        if (description !== undefined) {
            if (!description || typeof description !== "string" || description.trim().length === 0) {
                return res.status(400).json({
                    error: "Description is required and must be a non-empty string"
                });
            }
            if (description.length > 500) {
                return res.status(400).json({
                    error: "Description must be less than 500 characters"
                });
            }
            updateData.description = description.trim();
            hasUpdates = true;
        }

        if (!hasUpdates) {
            return res.status(400).json({
                error: "No valid fields to update"
            });
        }

        const updatedExpense = await prisma.expenses.update({
            where: { id: id.trim() },
            data: updateData
        });

        res.json({
            success: true,
            expense: updatedExpense,
            message: "Expense updated successfully"
        });

    } catch (error) {
        console.error("Error updating expense:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.status(500).json({
            error: "Internal server error",
            message: "Failed to update expense"
        });
    }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
            return res.status(400).json({
                error: "Invalid expense ID"
            });
        }

        const expense = await prisma.expenses.findUnique({
            where: { id: id.trim() }
        });

        if (!expense) {
            return res.status(404).json({
                error: "Expense not found"
            });
        }

        res.json({
            success: true,
            expense
        });

    } catch (error) {
        console.error("Error fetching expense:", error);
        res.status(500).json({
            error: "Internal server error",
            message: "Failed to fetch expense"
        });
    }
};

module.exports = {
    createExpenses,
    getAllExpenses,
    deleteExpense,
    updateExpense,
    getExpenseById
};