import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
export async function GET() {
  try {
    const res = await pool.query("SELECT NOW()");
    return NextResponse.json(res.rows);
  } catch (e) {
    return NextResponse.json({ error: "DB error", details: e });
  }
}
