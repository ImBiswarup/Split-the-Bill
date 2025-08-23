import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password, fullName } = await request.json();
    if (!email || !password || !fullName) {
        return NextResponse.json({ error: "Email, password, and full name are required." }, { status: 400 });
    }
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await axios.post(`${apiUrl}/api/users/create`, {
            email,
            password,
            name: fullName
        });
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Error signing up:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
