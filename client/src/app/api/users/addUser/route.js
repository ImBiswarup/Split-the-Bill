import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    const body = await req.json();
    const { groupId, userEmail, userName } = body;
    console.log("Received request to add user to group:", body);

    if (!groupId || (!userEmail && !userName)) {
        return NextResponse.json({ error: "Group ID and user email or name is required." }, { status: 400 });
    }

    try {
        const res = await axios.post("http://localhost:3000/api/groups/add", {
            groupId,
            userEmail,
            userName,
        });

        return NextResponse.json(res.data, { status: 200 });
    } catch (err) {
        console.error("Error adding user to group:", err.message);
        return NextResponse.json({ error: "Failed to add user to group." }, { status: 500 });
    }
}
