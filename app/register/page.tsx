"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully");
        window.location.href = "/login";
      } else {
        alert(data.error || "Register failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-[350px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Register 🚀
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-3 rounded cursor-pointer"
        >
          Register
        </button>

        <p className="text-center mt-4 text-sm">
          Already have account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}