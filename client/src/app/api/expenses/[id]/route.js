import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { id } = params;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${apiUrl}/api/expenses/${id}`);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error("Error fetching expense:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.put(`${apiUrl}/api/expenses/${id}`, body);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error("Error updating expense:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.delete(`${apiUrl}/api/expenses/${id}`);
        return NextResponse.json(res.data);
    } catch (error) {
        console.error("Error deleting expense:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
