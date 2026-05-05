import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("👉 Incoming:", email, password);

    const userRes = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    console.log("👉 DB user:", userRes.rows);

    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRes.rows[0];

    console.log("👉 DB password:", user.password);

    const valid = await bcrypt.compare(password, user.password);

    console.log("👉 Password match:", valid);

    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing");
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        tenant_id: user.tenant_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "Login success",
      token,
    });

  } catch (e: any) {
    console.error("🔥 LOGIN ERROR FULL:", e);

    return NextResponse.json(
      {
        error: "Login failed",
        details: e.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}