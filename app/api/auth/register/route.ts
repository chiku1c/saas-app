import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return NextResponse.json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        user_id: user.rows[0].id,
        tenant_id: user.rows[0].tenant_id,
        role: user.rows[0].role,
      },
      "secretkey",
      { expiresIn: "1d" },
    );

    return NextResponse.json({ message: "Login success", token });
  } catch (e) {
    return NextResponse.json({ error: "Login failed", details: e });
  }
}
