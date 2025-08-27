import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const { id: groupId } = params;
    const { ownerId, amount, description } = await req.json();

    const parsedAmount = Number(amount);

    if (!ownerId || !parsedAmount || !description) {
        return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    try {
        console.log(`Creating group bill with payload:`, { groupId, ownerId, amount: parsedAmount, description });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await axios.post(`${apiUrl}/api/groups/${groupId}/bills`, {
            ownerId,
            amount: parsedAmount,
            description
        });

        return NextResponse.json({ 
            bill: res.data.bill, 
            message: res.data.message,
            splitAmount: res.data.splitAmount,
            memberCount: res.data.memberCount
        }, { status: 200 });
    } catch (error) {
        console.error("Error creating group bill:", error?.response?.data || error.message);
        return NextResponse.json({ error: error?.response?.data || "Internal server error" }, { status: 500 });
    }
}
