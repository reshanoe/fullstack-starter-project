"use client";
import { useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      localStorage.setItem("token", res.data.access_token);
      Cookies.set("token", res.data.access_token);
      setTimeout(() => {
        router.push("/users");
      }, 100);
    } catch {
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-black text-2xl font-bold text-center">Login</h1>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 border rounded placeholder:text-gray-700 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded placeholder:text-gray-700 text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          type="button"
          className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => router.push("/register")}
        >
          Don't have an account? Register
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}
