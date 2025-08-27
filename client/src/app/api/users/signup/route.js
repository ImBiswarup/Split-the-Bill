import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { email, password, name } = await request.json();
    console.log('signup route hit', { email, password, name });

    if (!email || !password || !name) {
        return NextResponse.json({ error: "Email, password, and full name are required." }, { status: 400 });
    }
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/create`, {
            email,
            password,
            name
        });
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Error signing up:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
