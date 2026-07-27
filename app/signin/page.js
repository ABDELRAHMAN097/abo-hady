"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserRole } = useUser();
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast.error("Please enter both email and password.");
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.isAdmin ? "admin" : "user");
        toast.success("Signed in successfully");
        router.push(userData.isAdmin ? "/dashboard" : "/");
        setEmail("");
        setPassword("");
      } else {
        toast.error("User does not exist in Firestore!");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      const errorMessages = {
        "auth/invalid-credential": "Invalid email or password. Please try again.",
        "auth/user-not-found": "User not found. Please check your email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
      };
      toast.error(errorMessages[error.code] || "Error signing in. Please try again later.");
    }
  };

  return (
    <div 
    style={{ minHeight: "calc(100vh - 277.39px)" }}
    className="flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-lg bg-white rounded-md">
        <div className="md:w-1/2 flex flex-col justify-center items-center bg-[#CBE4E8] rounded-tl-md rounded-bl-md">
          <img src="/image/login.png" alt="Signin" className="w-3/4 mb-3" />
          <h2 className="text-xl font-bold text-gray-700 text-center">Welcome Back!</h2>
        </div>
        <form onSubmit={handleSignin} className="md:w-1/2 p-5">
          <h2 className="text-2xl font-bold mb-3 text-pink-500">Sign in to your account</h2>
          <p className="mb-2 text-gray-600">Enter your credentials below</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-1 border border-gray-300 rounded"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              maxLength={13}
              minLength={6}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-1 border border-gray-300 rounded pr-10 text-base"
              required
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500"
            >
              {showPassword ? <RiEyeLine size={20} /> : <RiEyeCloseLine size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-700 text-white py-3 rounded transition mt-4"
          >
            Sign In
          </button>
          <p className="mt-6 text-gray-600 text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
