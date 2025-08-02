"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch {
        setError("Failed to fetch users");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.post(
        "/users/",
        { email: addEmail, username: addUsername, password: addPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers([...users, res.data]);
      setAddEmail("");
      setAddUsername("");
      setAddPassword("");
    } catch {
      setError("Failed to add user");
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      setError("Failed to delete user");
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditEmail(user.email);
    setEditUsername(user.username);
  };

  const handleEditSave = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `/users/${id}`,
        { email: editEmail, username: editUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, email: editEmail, username: editUsername } : u
        )
      );
      setEditId(null);
    } catch {
      setError("Failed to update user");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditEmail("");
    setEditUsername("");
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-2">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Users
        </h1>
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Add User Form */}
        <form
          onSubmit={handleAddUser}
          className="flex flex-col sm:flex-row gap-2 mb-6 flex-wrap">
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-1 flex-1 min-w-[180px] text-gray-700 placeholder:text-gray-500"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Username"
            className="border rounded p-1 flex-1 min-w-[140px] text-gray-700 placeholder:text-gray-500"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            required
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-1 flex-1 min-w-[140px] text-gray-700 placeholder:text-gray-500"
            value={addPassword}
            onChange={(e) => setAddPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition min-w-[80px]">
            Add
          </button>
        </form>

        {/* Users List */}
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-2 text-gray-700 gap-2">
              {editId === user.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full flex-wrap">
                  <input
                    type="text"
                    className="border rounded p-1 flex-1 min-w-[120px] text-gray-700 placeholder:text-gray-500"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                  <input
                    type="email"
                    className="border rounded p-1 flex-1 min-w-[180px] text-gray-700 placeholder:text-gray-500"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition min-w-[70px]"
                    onClick={() => handleEditSave(user.id)}
                    type="button">
                    Save
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300 transition min-w-[70px]"
                    onClick={handleEditCancel}
                    type="button">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-700 break-all">
                    <strong className="text-gray-800">{user.username}</strong> -{" "}
                    {user.email}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                      onClick={() => handleEdit(user)}
                      type="button">
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(user.id)}
                      type="button">
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
