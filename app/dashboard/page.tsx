"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const menu = ["Dashboard", "Tasks", "Analytics", "Team"];
  const active = "Dashboard";

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    };
    fetchData();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-[#f5f7f9]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white rounded-r-3xl shadow p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold mb-8">💚 Donezo</h1>

         <nav className="space-y-3">
  {menu.map((item) => (
    <div
      key={item}
      className={`p-2 rounded-lg cursor-pointer ${
        active === item
          ? "bg-green-100 text-green-700"
          : "text-black hover:bg-gray-100"
      }`}
    >
      {item}
    </div>
  ))}
</nav>
        </div>

        <div className="bg-green-900 text-white p-4 rounded-xl">
          <p className="text-sm mb-2">Download our app</p>
          <button className="bg-green-500 px-3 py-1 rounded cursor-pointer">
            Download
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-green-700"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-4 gap-5 mb-6">

          <div className="bg-gradient-to-br from-green-600 to-green-400 text-white p-5 rounded-2xl shadow cursor-pointer">
            <p>Total Products</p>
            <h2 className="text-3xl font-bold">{products.length}</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow cursor-pointer">
            <p>Sold</p>
            <h2 className="text-3xl font-bold">10</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow cursor-pointer">
            <p>Running</p>
            <h2 className="text-3xl font-bold">5</h2>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow cursor-pointer">
            <p>Pending</p>
            <h2 className="text-3xl font-bold">2</h2>
          </div>

        </div>

        {/* ANALYTICS + SIDE */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          {/* CHART BOX */}
          <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-4">Product Analytics</h2>

            <div className="flex gap-4 items-end h-40">
              {[40, 70, 50, 90, 60].map((h, i) => (
                <div
                  key={i}
                  className="bg-green-500 w-10 rounded-lg cursor-pointer hover:bg-green-600"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-semibold mb-3">Quick Actions</h2>

            <button className="w-full bg-green-600 text-white py-2 rounded-lg mb-3 cursor-pointer">
              Add Product
            </button>

            <button className="w-full border py-2 rounded-lg cursor-pointer">
              Import Data
            </button>
          </div>

        </div>

        {/* PRODUCT LIST */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Products</h2>

          {products.length === 0 && (
            <p className="text-gray-500">No products found</p>
          )}

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((p: any) => (
              <div
                key={p.id}
                className="p-4 border rounded-xl hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹ {p.price}</p>
                <p className="text-gray-500 text-sm">
                  Qty: {p.quantity}
                </p>
              </div>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}