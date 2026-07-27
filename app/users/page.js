"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "../lib/firebase";
import { db } from "../lib/firebase";
import ProtectedRoute from "../ProtectedRoute/page";

export default function GetUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const allUsers = userSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

       
        const regularUsers = allUsers.filter((user) => !user.isAdmin);
        setUsers(regularUsers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (uid) => {
    const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", uid)); 
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid)); 
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error fetching users: {error.message}</div>;
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Regular Users</h1>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.uid} className="mb-2 p-2 border-b border-gray-200 flex justify-between items-center">
                <span>{user.email}</span>
                <button
                  onClick={() => handleDelete(user.uid)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  حذف
                </button>
              </li>
            ))
          ) : (
            <p>No regular users found.</p>
          )}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
