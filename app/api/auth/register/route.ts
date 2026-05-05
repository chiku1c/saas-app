import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const hashed = await bcrypt.hash(password, 10);

    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "User already exists" });
    }

    await pool.query(
      "INSERT INTO users(email,password) VALUES($1,$2)",
      [email, hashed]
    );

    return NextResponse.json({ message: "User registered" });
  } catch (e) {
    return NextResponse.json({ error: "Register failed", details: e });
  }
}