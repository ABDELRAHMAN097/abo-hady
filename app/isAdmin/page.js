"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase"; // تأكد أن استيراد db و auth صحيح
import { onAuthStateChanged } from "firebase/auth";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaChalkboardUser } from "react-icons/fa6";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user); // تحديث المستخدم الحالي
        try {
          const currentUserRef = doc(db, "users", user.uid);
          const currentUserSnap = await getDoc(currentUserRef);

          if (currentUserSnap.exists() && currentUserSnap.data().isAdmin) {
            setIsAdmin(true);

            // جلب بيانات المستخدمين
            const usersCollection = collection(db, "users");
            const userSnapshot = await getDocs(usersCollection);
            const userList = userSnapshot.docs.map((doc) => ({
              uid: doc.id,
              ...doc.data(),
            }));
            setUsers(userList);
          } else {
            console.error("Access denied: You are not an admin.");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        console.error("No user is logged in.");
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleAdmin = async (uid, currentIsAdmin) => {
    if (!isAdmin) {
      console.error("Access denied: You are not an admin.");
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { isAdmin: !currentIsAdmin });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === uid ? { ...user, isAdmin: !currentIsAdmin } : user
        )
      );
    } catch (error) {
      console.error("Error updating admin role:", error);
    }
  };
  // handleDelete
  const handleDelete = async (uid) => {
    if (!isAdmin) {
      console.error("Access denied: You are not an admin.");
      return;
    }
  
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        console.error("User not found in Firestore.");
        return;
      }
  
      console.log("Deleting user:", userSnap.data());
  
      await deleteDoc(userRef);
      setUsers(users.filter((user) => user.uid !== uid));
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  
  

  const columnNames = [
    "Photo",
    "Member name",
    "Mobile",
    "Email",
    "Status",
    "Operation",
    "Action",
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="flex justify-start items-center min-h-screen border rounded-lg shadow-md p-4">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="text-gray-300">
              <tr>
                {columnNames.map((name, colIndex) => (
                  <th
                    key={colIndex}
                    className="px-4 py-2 text-sm md:text-base lg:text-lg font-bold text-gray-500"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="text-center text-gray-700">
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    {user.phone}
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    {user.isAdmin ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 text-xs md:text-sm lg:text-base">
                    <button
                      className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => toggleAdmin(user.uid, user.isAdmin)}
                    >
                      {user.isAdmin ? (
                        <FaChalkboardUser />
                      ) : (
                        <MdAdminPanelSettings />
                      )}
                    </button>
                  </td>
                  <td 
                  className="px-4 py-2 text-xs md:text-sm lg:text-base text-pink-400 cursor-pointer"
                  onClick={() => handleDelete(user.uid)}
                  >
                    delete
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      
    </div>
  );
}
