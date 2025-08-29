import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const apiUrl =  process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/api/groups/${id}`);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error("Error fetching group:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
