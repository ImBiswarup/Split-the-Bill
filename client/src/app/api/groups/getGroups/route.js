import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log(`Fetching groups with ID: ${id}`);
    try {
        const response = await axios.get(`http://localhost:3000/api/groups/${id}`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching groups:", error);
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}