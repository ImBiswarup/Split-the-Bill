const prisma = require('../DB/prismaClient');


const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Creating user with name: ${name}, email: ${email} and password: ${password}`);
    try {
        const user = await prisma.user.create({
            data: { name, email, password },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
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

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    loginUser
};