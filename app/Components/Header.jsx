"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/image/1.png";
import { FaSearch, FaRegHeart } from "react-icons/fa";
import { IoPersonOutline, IoBagHandleOutline } from "react-icons/io5";
import { useUser } from "../context/UserContext";
import LogoutButton from "../LogoutButton/LogoutButton";

const Header = () => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header flex items-center justify-between p-2 bg-white shadow-md">
      <a
        href="/"
        className="flex items-center justify-center"
      >
        <div className="w-[100px]">
          <Image
            src={logo}
            alt="logo"
            className="w-full"
            width={900}
            height={900}
            priority
          />
        </div>
      </a>

      <div className="flex items-center gap-3">
        {!user ? (
          <Link
            className="text-gray-700 hover:text-pink-500 transition duration-300"
            href="/signup"
          >
            <IoPersonOutline className="text-gray-700 text-[20px] hover:text-pink-500 transition duration-300" />
          </Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            {/* update profile photo / state */}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-7 h-7 mx-auto rounded-full border-[1.5px] border-pink-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-[1.5px] border-white rounded-full"></span>
            </div>

            {/* DropdownOpen */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                <Link
                  href="/MyAcount"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  profile
                </Link>
                <LogoutButton className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" />
              </div>
            )}
          </div>
        )}

        <Link
          className="text-gray-700 hover:text-pink-500 transition duration-300"
          href="/Wishlist"
        >
          <FaRegHeart size={5} className="size-5" />
        </Link>
        <Link
          className="text-gray-700 hover:text-pink-500 transition duration-300"
          href="/Shoping"
        >
          <IoBagHandleOutline size={5} className="size-5" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
