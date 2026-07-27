"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { db } from "../lib/firebase"; // تأكد من صحة المسار
import { collection, getDocs } from "firebase/firestore";

const Navbar = () => {
  const { user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState([]); // المنتجات الأصلية
  const [filteredProducts, setFilteredProducts] = useState([]); // المنتجات بعد الفلترة
  const [searchQuery, setSearchQuery] = useState(""); // نص البحث
  const searchRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("خطأ في جلب المنتجات:", error);
      }
    };

    fetchProducts();
  }, []);

  // تحديث المنتجات عند البحث
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts([]);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFilteredProducts([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-t-2 w-full flex items-center justify-between p-4 bg-white shadow-md relative">
      <div className="relative">
      {/* toggle icon */}
      <button
        className="md:hidden text-2xl p-2 focus:outline-none"
        onClick={toggleMenu}
      >
        {showMenu ? <FaTimes /> : <FaBars />}
      </button>
      {/* list */}
      <div
       className={`flex flex-col md:flex-row md:items-center gap-3 fixed right-0 top-[140px] md:static w-full bg-white p-3 z-10 
        ${showMenu ? "flex" : "hidden md:flex"}`}
        
      >
        <Link className="link text-[17px]" href="/" onClick={closeMenu}>
          <FaHome className="text-[19px]" />
        </Link>

        <div className="relative">
          <button
            className="link flex items-center text-[17px]"
            onClick={toggleDropdown}
          >
            Categories <IoMdArrowDropdown className="text-[17px]" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 z-50 mt-2 w-32 bg-white border rounded-lg shadow-lg">
              <Link
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                href="/Men"
                onClick={closeMenu}
              >
                Men
              </Link>
              <Link
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                href="/Women"
                onClick={closeMenu}
              >
                Women
              </Link>
              <Link
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-lg"
                href="/Accessories"
                onClick={closeMenu}
              >
                Accessories
              </Link>
            </div>
          )}
        </div>

        {user?.isAdmin && (
          <Link
            className="link text-[17px] font-medium"
            href="/dashboard"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
        )}
      </div>
    </div>
     {/* search bar */}
     <div className="relative w-full max-w-md" ref={searchRef}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full focus:outline-none  focus:border-pink-300"
        />
        {/* عرض النتائج فقط عند البحث */}
        {searchQuery && filteredProducts.length > 0 && (
          <div className="absolute w-full mt-1 rounded-full shadow-lg z-50">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/DetailsProduct/${product.id}`}
                className="block mb-1 mt-1 px-4 py-2 text-gray-800 bg-white hover:bg-gray-200 rounded-full"
                onClick={() => setSearchQuery("")} // إخفاء البحث بعد الاختيار
              >
                {product.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
