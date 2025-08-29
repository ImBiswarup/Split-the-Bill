import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { amount, description } = await request.json();
    console.log(`Creating expense with data:`, { amount, description });
    try {
        const apiUrl =  process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.post(`${apiUrl}/api/expenses/create`, { amount, description });
        return NextResponse.json(res.data, { status: 201 });
    } catch (error) {
        console.error("Error creating expense:", error?.response?.data || error.message);
        return NextResponse.json({ error: error?.response?.data || "Internal server error" }, { status: 500 });
    }
}