const prisma = require('../DB/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Creating user with name: ${name}, email: ${email} and password: ${password}`);
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
const getUser = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching user with ID: ${id}`);

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                adminGroups: true,
                groups: true,
                bills: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Logging in user with email: ${email}`);

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                adminGroups: true,
                groups: true,
                bills: true,
            },
        });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined in environment variables");
            return res.status(500).json({ error: "Internal server error" });
        }

        const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            adminGroups: user.adminGroups,
            userGroups: user.groups,
            groups: user.groups,
            bills: user.bills,
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

        const { password: _, ...safeUser } = user;

        res.json({ message: "Login successful", token, user: safeUser });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                adminGroups: true,
                groups: true,
                bills: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email },
        });
        res.json(user);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "User deleted successfully", user });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
const createBills = async (req, res) => {
    const { ownerId, amount, description } = req.body;
    console.log(`Creating bill for user ID: ${ownerId}, amount: ${amount}, description: ${description}`);
    try {
        const bill = await prisma.bills.create({
            data: { ownerId, amount, description },
        });
        res.status(200).json({ bill, message: "Bill created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
const splitBillAmongUsers = async (req, res) => {
    const { billId, userIds } = req.body;
    try {
        const bill = await prisma.bills.findUnique({ where: { id: billId } });

        if (!bill) {
            return res.status(404).json({ error: "Bill not found" });
        }

        const splitAmount = bill.amount / userIds.length;

        // Save split records
        const splits = userIds.map(userId => ({
            userId,
            billId,
            amount: splitAmount,
        }));
        await prisma.billSplit.createMany({ data: splits });

        // Add the split amount to each user's own bills
        await Promise.all(
            userIds.map(userId =>
                prisma.bills.create({
                    data: {
                        ownerId: userId, // using your schema's required ownerId
                        amount: splitAmount,
                        description: `Share of bill #${billId}`,
                    },
                })
            )
        );

        res.status(200).json({ message: "Bill split successfully", splits });
    } catch (error) {
        console.error("Error splitting bill:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const deleteBills = async (req, res) => {
    const { id } = req.body;
    try {
        console.log(`Deleting bill with ID: ${id}`);
        const bill = await prisma.bills.delete({
            where: { id },
        });
        res.json({ message: "Bill deleted successfully", bill });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Bill not found" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    loginUser,
    createBills,
    deleteBills,
    splitBillAmongUsers
};