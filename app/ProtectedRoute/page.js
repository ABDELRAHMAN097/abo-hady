"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/signin");
      return;
    }

    if (adminOnly && !user.isAdmin) {
      router.replace("/out");
    }
  }, [user, loading, adminOnly, router]);

  if (loading) {
    return (
      <div className="loading-overlay flex justify-center items-center min-h-screen">
        <BarLoader color="#d60096" />
      </div>
    );
  }

  if (!user) return null;

  if (adminOnly && !user.isAdmin) return null;

  return <>{children}</>;
}