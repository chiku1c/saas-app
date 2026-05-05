"use client";
import { useState, useEffect } from "react";

export default function ProductForm({ refresh }: any) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [token, setToken] = useState("");

  // 🔥 fix localStorage error
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const addProduct = async () => {
    if (!token) return alert("Login first");

    await fetch("/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price, quantity }),
    });

    setName("");
    setPrice("");
    setQuantity("");

    refresh();
  };

  return (
    <div className="mb-5">
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input placeholder="Qty" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <button onClick={addProduct}>Add</button>
    </div>
  );
}