import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); 

  console.log(`Fetching user with ID: ${id}`);

  try {
    // Use relative URL instead of hardcoded localhost
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`); 
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
