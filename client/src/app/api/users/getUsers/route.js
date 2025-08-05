import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get('http://localhost:3000/api/users/all');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
