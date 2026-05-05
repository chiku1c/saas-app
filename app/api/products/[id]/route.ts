import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";

function getUser(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("No token");
  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET as string) as any;
}

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUser(req);
    const { name, price, quantity } = await req.json();

    await pool.query(
      `UPDATE products
       SET name=$1, price=$2, quantity=$3
       WHERE id=$4 AND tenant_id=$5`,
      [name, price, quantity, params.id, user.tenant_id]
    );

    return NextResponse.json({ message: "Product updated" });
  } catch (e) {
    return NextResponse.json({ error: "Failed", details: e }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = getUser(req);

    await pool.query(
      `DELETE FROM products
       WHERE id=$1 AND tenant_id=$2`,
      [params.id, user.tenant_id]
    );

    return NextResponse.json({ message: "Product deleted" });
  } catch (e) {
    return NextResponse.json({ error: "Failed", details: e }, { status: 500 });
  }
}