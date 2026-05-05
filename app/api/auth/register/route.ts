import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, company } = await req.json();

    // 1. hash password
    const hashed = await bcrypt.hash(password, 10);

    // 2. create tenant
    const tenantRes = await pool.query(
      "INSERT INTO tenants(name) VALUES($1) RETURNING id",
      [company]
    );

    const tenant_id = tenantRes.rows[0].id;

    // 3. create user
    const userRes = await pool.query(
      `INSERT INTO users(email,password,tenant_id,role)
       VALUES($1,$2,$3,$4)
       RETURNING *`,
      [email, hashed, tenant_id, "admin"]
    );

    // 4. token
    const token = jwt.sign(
      {
        user_id: userRes.rows[0].id,
        tenant_id,
        role: "admin",
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ message: "Registered", token });

  } catch (e: any) {
    return NextResponse.json(
      { error: "Register failed", details: e.message },
      { status: 500 }
    );
  }
}