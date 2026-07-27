"use client";
import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext/CartContext"; 
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiCloseCircleLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { IoIosStar } from "react-icons/io";
import { GiShoppingCart } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function Page() {
  const { addToCart, cartItems, wishlistItems, removeFromWishlist } = useCart();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [CurrentImage, setCurrentImage] = useState("");
  const [currentName, setcurrentName] = useState("");

  const openModal = (description, imageUrl, Name) => {
    setCurrentDescription(description);
    setCurrentImage(imageUrl);
    setcurrentName(Name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Add product to shopping cart
  const handleAddToCart = (product) => {
    addToCart(product);
    localStorage.setItem("cartItems", JSON.stringify([...cartItems, product]));
    toast.success(
      <div>
        <span className="text-green-500">{product.name}</span> has been added to
        your cart!
      </div>,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  };

    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % 4); 
      }, 2000); 
  
      return () => clearInterval(interval);
    }, []);
  

  return (
      <div className="container min-h-[44.5vh] mx-auto p-2">
        <h1 className="text-3xl my-5 font-semibold text-center">Wishlist</h1>
        <div className="products px-2 md:p-0">
          {wishlistItems.map((product) => (
              <div
              onClick={() => router.push(`/DetailsProduct/${product.id}`)} 
              className="border relative my-2 mx-1 w-[300px] md:w-48 block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark min-h-[363px] md:min-h-[230px] cursor-pointer"
            >
              {" "}
              <div>
                <div>
                  <img
                    className="rounded-t-lg w-full h-[250px] md:h-48 object-cover"
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                  />
                </div>
                <div className="relative text-right p-2">
                  <h2
                    dir="rtl"
                    className="text-gray-800 font-normal text-sm leading-none mb-1 py-1 overflow-hidden text-ellipsis line-clamp-2"
                  >
                    {product.description}
                  </h2>
                  <p className="text-gray-600 font-semibold flex items-center justify-end gap-2 text-right w-full">
                        <span className="bg-pink-500 text-[12px] text-white text-sm px-[2px] py-[2px] rounded">
                          -{product.discount}%
                        </span>
                        <div className="flex flex-row text-green-400 text-[12px] font-bold">
                          <p className="mr-1">جنيه</p>
                          <p>{product.price.toFixed(2)}</p>
                        </div>
                        <span className="line-through text-[12px] text-gray-400">
                          {product.price.toFixed(2)}
                        </span>
                      </p>
                  
                  <p className="absolute top-[-18px] right-1 text-pink-500 flex items-center text-[14px] font-light">
                    {product.rating} <IoIosStar className="text-[14px]" />
                  </p>
                    
                  <div className="h-6 overflow-hidden text-gray-700 font-medium">
                    <motion.div
                      key={currentIndex}
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-right"
                    >
                      {
                        [
                          <span
                            key="fast-selling"
                            className="flex items-center justify-end gap-1"
                          >
                            بتخلص بسرعة
                            <GiShoppingCart className="text-pink-500" />{" "}
                          </span>,
                          <span key="stock" className="text-[14px]">
                            {product.stock} عدد القطع المتاحة
                          </span>,
                          <span
                            key="discount"
                            className="text-[14px] text-green-400"
                          >
                            {product.brand}
                          </span>,
                          <span
                            key="delivery"
                            className="flex items-center justify-end gap-1"
                          >
                            توصيل مجاني
                            <TbTruckDelivery className="text-pink-500" />{" "}
                          </span>,
                        ][currentIndex]
                      }
                    </motion.div>
                  </div>
                </div>
                <button
                  className="absolute left-1 top-1 text-gray-500 bg-white rounded p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(product.id); 
                  }}
                >
                  <RiCloseCircleLine />
                </button>
                <button
                  className="absolute left-10 top-1 text-gray-500 bg-white rounded p-1"
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation();
                    handleAddToCart(product); 
                  }}
                >
                  <GiShoppingCart className="text-pink-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-3">
            <div className="bg-white p-4 rounded-lg max-w-md w-full text-center relative">
              <img
                className="rounded-t-lg w-full object-cover"
                src={CurrentImage}
                alt={CurrentImage}
              />
              <h2 className="text-lg font-bold mb-2">{currentName}</h2>
              <p>{currentDescription}</p>
              <button
                className="text-pink-500 hover:text-pink-700 text-3xl rounded p-1 mt-4"
                onClick={closeModal}
              >
                <IoMdCloseCircle />
              </button>
            </div>
          </div>
        )}
      </div>
  );
}

