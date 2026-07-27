"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "react-toastify";
import Link from "next/link";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let imageUrl = "";

      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: name,
        phone: phone,
        imageUrl: imageUrl, 
        isAdmin: false,
      });

      toast.success("Account created successfully!");
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setImage(null);
    } catch (error) {
      console.error("Error signing up:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use.");
      } else {
        toast.error("Error creating account. Please try again.");
      }
    }
  };

//Cloudinary
  const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  return data.secure_url;
};

  return (
    <div 
    style={{ minHeight: "calc(100vh - 277.39px)" }}
    className="flex items-center justify-center p-5 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-lg bg-white rounded-md">
        <div className="md:w-1/2 flex flex-col justify-center items-center bg-[#CBE4E8] rounded-tl-md rounded-bl-md">
          <img src="/image/login.png" alt="Signup" className="w-3/4 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 text-center">
            Join Us Today!
          </h2>
        </div>
        <form onSubmit={handleSignup} className="md:w-1/2 p-5">
          <h2 className="text-2xl font-bold mb-4 text-pink-500">
            Create an account
          </h2>
          <p className="mb-3 text-gray-600">Enter your details below</p>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-1 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-1 border border-gray-300 rounded"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mb-4 p-1 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-700 text-white py-3 rounded transition"
          >
            Create Account
          </button>
          <p className="mt-6 text-gray-600 text-center">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-500">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
