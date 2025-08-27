const prisma = require("../DB/prismaClient");

const updatePayment = async (req, res) => {
    const { billId, userId, status } = req.body;
    console.log('Hit in the updatePayment API');

    try {
        const isPaid = status === true || status === 'paid';

        const updatedSplit = await prisma.billSplit.updateMany({
            where: {
                billId,
                userId,
                isPaid: false, 
            },
            data: {
                isPaid,
            }
        });

        if (updatedSplit.count === 0) {
            return res.status(404).json({ error: "No unpaid bill split found for this user" });
        }

        const unpaidSplits = await prisma.billSplit.count({
            where: { billId, isPaid: false }
        });

        if (unpaidSplits === 0) {
            await prisma.bills.update({
                where: { id: billId },
                data: { isPaid: true }
            });
        }

        res.json({ message: "Payment updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update payment" });
    }
};

module.exports = {
    updatePayment
};
