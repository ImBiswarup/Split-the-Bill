import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password, fullName } = await request.json();
    if (!email || !password || !fullName) {
        return NextResponse.json({ error: "Email, password, and full name are required." }, { status: 400 });
    }
    try {
        const response = await axios.post('http://localhost:3000/api/users/create', {
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
