import axios from "axios";
import { NextResponse } from "next/server";


export async function POST(req, res) {
    const { name, description, adminId } = await req.json();
    console.log(`Creating group with data:`, { name, description, adminId });

    if (!name || !description || !adminId) {
        return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    try {
        const res = await axios.post('http://localhost:3000/api/groups/create', {
            name,
            description,
            adminId
        });

        return NextResponse.json(res.data, { status: 201 });
    } catch (error) {
        console.error("Error creating group:", error);
        return NextResponse.json({ error: 'Failed to create group.' }, { status: 500 });
    }
}