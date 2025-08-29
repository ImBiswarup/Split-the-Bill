import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId, amount, description } = await req.json();

    const parsedAmount = Number(amount);

    if (!userId || !parsedAmount || !description) {
        return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    try {
        console.log(`Creating bill with payload:`, { userId, amount: parsedAmount, description });

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.post(`${apiUrl}/api/users/bills/create`, {
            ownerId: userId,
            amount: parsedAmount,
            description
        });

        return NextResponse.json({ bill: res.data, message: "Bill created successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error creating bill:", error?.response?.data || error.message);
        return NextResponse.json({ error: error?.response?.data || "Internal server error" }, { status: 500 });
    }
}
