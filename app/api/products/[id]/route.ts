import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";

async function getUser(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) throw new Error("No token");

  const token = auth.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET as string) as any;
}

// ✅ UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // 🔥 IMPORTANT
) {
  try {
    const user = await getUser(req);
    const { id } = await context.params;         // 🔥 await करना पड़ेगा

    const { name, price, quantity } = await req.json();

    await pool.query(
      `UPDATE products
       SET name=$1, price=$2, quantity=$3
       WHERE id=$4 AND tenant_id=$5`,
      [name, price, quantity, id, user.tenant_id]
    );

    return NextResponse.json({ message: "Product updated" });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed", details: e.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // 🔥 IMPORTANT
) {
  try {
    const user = await getUser(req);
    const { id } = await context.params;

    await pool.query(
      `DELETE FROM products
       WHERE id=$1 AND tenant_id=$2`,
      [id, user.tenant_id]
    );

    return NextResponse.json({ message: "Product deleted" });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Failed", details: e.message },
      { status: 500 }
    );
  }
}