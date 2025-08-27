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
    const { groupId, userId, userEmail, userName } = req.body;

    console.log('Adding user to group with data:', req.body);

    if (!groupId) {
        return res.status(400).json({ error: "Group ID is required." });
    }

    try {
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: { users: true },
        });

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        let user;
        if (userId) {
            user = await prisma.user.findUnique({
                where: { id: userId },
            });
        } else if (userEmail) {
            user = await prisma.user.findUnique({
                where: { email: userEmail },
            });
        } else if (userName) {
            user = await prisma.user.findFirst({
                where: { name: userName },
            });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const alreadyInGroup = group.users.some(u => u.id === user.id);
        if (alreadyInGroup) {
            return res.status(400).json({ error: "User is already in the group." });
        }

        await prisma.group.update({
            where: { id: groupId },
            data: {
                users: {
                    connect: { id: user.id },
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
                },
                bills: {
                    include: {
                        owner: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        },
                        splits: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
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
const createGroupBill = async (req, res) => {
    const { id: groupId } = req.params;
    const { ownerId, amount, description } = req.body;

    console.log('Creating group bill with data:', { groupId, ownerId, amount, description });

    if (!ownerId || !amount || !description) {
        return res.status(400).json({ error: "Owner ID, amount, and description are required." });
    }

    try {
        // Verify the group exists and get its members
        const group = await prisma.group.findUnique({
            where: { id: groupId },
            include: {
                users: true,
                admin: true
            }
        });

        if (!group) {
            return res.status(404).json({ error: "Group not found." });
        }

        // Verify the owner is part of the group
        const isOwnerInGroup = group.users.some(user => user.id === ownerId) || group.admin.id === ownerId;
        if (!isOwnerInGroup) {
            return res.status(403).json({ error: "Owner must be a member of the group." });
        }

        // Create the main bill
        const bill = await prisma.bills.create({
            data: {
                ownerId,
                groupId,
                amount: parseFloat(amount),
                description
            }
        });

        // Get all group members (including admin)
        const allMembers = [...group.users, group.admin];
        const memberCount = allMembers.length;

        if (memberCount === 0) {
            return res.status(400).json({ error: "Group has no members to split the bill with." });
        }

        // Calculate split amount per member
        const splitAmount = parseFloat(amount) / memberCount;

        // Create bill splits for each member
        const billSplits = await Promise.all(
            allMembers.map(member => 
                prisma.billSplit.create({
                    data: {
                        billId: bill.id,
                        userId: member.id,
                        amount: splitAmount
                    }
                })
            )
        );

        // Get the created bill with splits
        const billWithSplits = await prisma.bills.findUnique({
            where: { id: bill.id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                splits: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json({ 
            bill: billWithSplits, 
            message: "Group bill created and split successfully",
            splitAmount: splitAmount,
            memberCount: memberCount
        });
    } catch (error) {
        console.error("Error creating group bill:", error);
        res.status(500).json({ error: "Failed to create group bill." });
    }
};

module.exports = {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup,
    createGroupBill
};