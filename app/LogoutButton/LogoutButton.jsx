"use client";
import { IoIosLogOut } from "react-icons/io";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext"; // اتأكد إنك مستدعي المسار الصحيح

const LogoutButton = () => {
  const { logout } = useUser(); // استدعاء دالة تسجيل الخروج من useUser

  const handleLogout = async () => {
    try {
      await logout(); // تنفيذ عملية تسجيل الخروج
      router.push("/signin");
      console.log("User logged out successfully.");
      toast.success("User logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("User logged out successfully.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 flex flex-row items-center gap-1"
    >
      <IoIosLogOut className="text-[20px]"/>logout
    </button>
  );
};

export default LogoutButton;
