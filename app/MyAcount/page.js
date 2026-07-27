"use client";
import React from "react";
import { useUser } from "../context/UserContext";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { IoIosLogOut, IoMdSettings } from "react-icons/io";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { FaPowerOff } from "react-icons/fa";


const ProfilePage = () => {
  const { user, userRole, loading, logout } = useUser();

  if (loading) {
    return (
      <p className="text-center text-white text-xl">جارٍ تحميل البيانات...</p>
    );
  }

  if (!user) {
    return (
      <div 
      style={{ minHeight: `calc(100vh - 140px - 65px - 68.3906px)` }}
      className="flex flex-col items-center justify-center bg-slate-950 p-5">
       <FaPowerOff className="text-white text-center text-5xl"/>
        <p className="w-full text-white text-center text-xl">
          You must be logged in to view the profile
        </p>
      </div>
    );
  }

  return (
    <div 
    className="max-w-sm mx-auto mt-10 p-6 bg-white border-2 shadow-lg rounded-lg text-center relative m-1">
      {/* go back */}
      <div className="absolute left-3 top-3">
        <Link href="/">
          <FaLongArrowAltLeft className="text-pink-500 text-[30px] p-1.5 rounded-full shadow-xl cursor-pointer" />
        </Link>
      </div>
      {/* setting */}
      <div className="absolute right-3 top-3">
        <Link href="/MyAcount/EditAcount">
          <IoMdSettings className="text-pink-500 text-[30px] p-1.5 rounded-full shadow-xl cursor-pointer" />
        </Link>
      </div>
      {/*  profile photo */}
      <div className="relative w-24 h-24 mx-auto">
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-full h-full rounded-full border-4 border-gray-200"
        />
        <Link href="/MyAcount/EditAcount">
          <div className="absolute bottom-1 right-1 bg-pink-500 p-1.5 rounded-full shadow-md cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14l-4.242.707.707-4.242L14.586 2.586a2 2 0 012.828 0z" />
            </svg>
          </div>
        </Link>
      </div>

      {/* username*/}
      <h2 className="text-xl font-bold mt-4">{user.name}</h2>

      {/* user info */}
      <div className="text-left mt-6">
        <div className="flex items-center text-gray-700 mb-3">
          <FaEnvelope className="text-pink-500 w-5 h-5 mr-2" />
          <p className="text-sm">{user.email}</p>
        </div>
        <div className="flex items-center text-gray-700">
          <FaPhone className="text-pink-500 w-5 h-5 mr-2" />
          <p className="text-sm">
            {user.phone ? user.phone : "رقم الهاتف غير متاح"}
          </p>
        </div>
      </div>

      {/* logout button */}
      <button
        onClick={logout}
        className="mt-8 w-full px-6 py-2 flex flex-row items-center gap-1 justify-center text-white bg-pink-500 rounded-lg font-semibold pink:bg-orange-600 transition"
      >
        <IoIosLogOut className="text-[20px]" />
        logout
      </button>
    </div>
  );
};

export default ProfilePage;
