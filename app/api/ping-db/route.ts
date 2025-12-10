import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    return NextResponse.json({ ok: true, host: conn.connection.host });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}