"use client";
import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [token, setToken] = useState("");

  // 🔥 fix localStorage issue
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  const fetchProducts = async () => {
    if (!token) return;

    const res = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // 🔥 fix map error
    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      console.error("API ERROR:", data);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const deleteProduct = async (id: number) => {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  return (
    <div className="p-10">
      <h1>Dashboard</h1>

      <ProductForm refresh={fetchProducts} />

      {products.length === 0 && <p>No products</p>}

      {products.map((p: any) => (
        <div key={p.id} className="border p-2 m-2">
          <h3>{p.name}</h3>
          <p>₹ {p.price}</p>
          <p>Qty: {p.quantity}</p>
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}