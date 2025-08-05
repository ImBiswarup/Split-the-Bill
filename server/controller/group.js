const prisma = require("../DB/prismaClient");

const createGroup = async (req, res) => {
    const { name, description, adminId } = req.body;

    console.log('Creating group with data:', req.body);

    if (!name || !adminId) {
        return res.status(400).json({ error: "Name and adminId are required." });
    }

    try {
        const adminExists = await prisma.user.findUnique({
            where: { id: adminId },
        });

        if (!adminExists) {
            return res.status(404).json({ error: "Admin user not found." });
        }

        const group = await prisma.group.create({
            data: {
                name,
                description,
                admin: {
                    connect: { id: adminId },
                },
            },
        });

        res.status(201).json({ group, message: "Group created successfully" });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ error: "Failed to create group." });
    }
};

const addUserToGroup = async (req, res) => {
    let { groupId, userId } = req.body;

    console.log('Adding user to group with data:', req.body);


    if (!groupId || !userId) {
        return res.status(400).json({ error: "Group ID and User ID are required." });
    }

    try {
        // Fetch group and its users
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { users: true }, // Include relation
        });

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Check if user already in group
        const alreadyInGroup = group.users.some(u => u.id === userId);
        if (alreadyInGroup) {
            return res.status(400).json({ error: "User is already in the group." });
        }

        // Connect user to group
        await prisma.group.update({
            where: { id: groupId },
            data: {
                users: {
                    connect: { id: userId },
                },
            },
        });

        res.status(200).json({ message: "User added to group successfully." });
    } catch (error) {
        console.error("Error adding user to group:", error);
        res.status(500).json({ error: "Failed to add user to group." });
    }
};

const getGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await prisma.group.findUnique({
            where: { id },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                admin: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
        });

        if (!group) {
            return res.status(404).json({ error: "Group not found" });
        }

        res.json(group);
    } catch (error) {
        console.error("Error retrieving group:", error);
        res.status(500).json({ error: "Failed to retrieve group" });
    }
};

const updateGroup = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        const group = await prisma.group.update({
            where: { id: id },
            data: { name, description },
        });
        res.json(group);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(500).json({ error: "Failed to update group" });
    }
}

const deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await prisma.group.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: "Group deleted successfully", group });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Group not found" });
        }
        res.status(500).json({ error: "Failed to delete group" });
    }
}

module.exports = {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup
};