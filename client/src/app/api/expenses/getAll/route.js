import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/api/expenses`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}