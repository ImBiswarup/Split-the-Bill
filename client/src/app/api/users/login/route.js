import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password } = await request.json();
    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    try {
        const response = await axios.post('http://localhost:3000/api/users/login', {
            email,
            password
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
