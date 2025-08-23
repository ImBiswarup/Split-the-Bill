import { NextResponse } from "next/server";
import axios from 'axios';

export async function DELETE(request) {
    const { id } = await request.json();

    console.log(id);

    if (!id) {
        return NextResponse.json({ error: "Missing bill ID" }, { status: 400 });
    }

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await axios.delete(`${apiUrl}/api/users/bills/delete`, {
            data: { id: id },
        });
        console.log(`Bill with ID ${id} deleted successfully`, res.data);

        return NextResponse.json({ message: "Bill deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting bill:", error?.response?.data || error.message);
        return NextResponse.json({ error: error?.response?.data || "Internal server error" }, { status: 500 });
    }
}
