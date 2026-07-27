"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      const data = userSnap.data();
      const isAdmin = data.isAdmin ?? false;

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: data.name,
        phone: data.phone,
        imageUrl: data.imageUrl || "/default-avatar.png",
        isAdmin,
      });

      setUserRole(isAdmin ? "admin" : "user");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUser = async (newData) => {
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid), newData);

    setUser((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const deleteUser = async (uid) => {
    await deleteDoc(doc(db, "users", uid));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userRole,
        loading,
        updateUser,
        deleteUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);