import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");

    if (!auth) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = auth.split(" ")[1];

    // 🔥 SAME SECRET use karna hai
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const { name, price, quantity } = await req.json();

    // basic validation
    if (!name || !price || !quantity) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO products(name,price,quantity,tenant_id) VALUES($1,$2,$3,$4)",
      [name, price, quantity, decoded.tenant_id]
    );

    return NextResponse.json({ message: "Product added" });

  } catch (e) {
    return NextResponse.json({ error: "Failed", details: e }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) return NextResponse.json({ error: "No token" }, { status: 401 });

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // optional: query params (search, limit)
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const limit = Number(searchParams.get("limit") || 50);

    let sql = "SELECT * FROM products WHERE tenant_id=$1";
    const params: any[] = [decoded.tenant_id];

    if (q) {
      sql += " AND name ILIKE $2";
      params.push(`%${q}%`);
    }

    sql += " ORDER BY id DESC LIMIT " + limit;

    const res = await pool.query(sql, params);

    return NextResponse.json(res.rows);
  } catch (e) {
    return NextResponse.json({ error: "Failed", details: e }, { status: 500 });
  }
}