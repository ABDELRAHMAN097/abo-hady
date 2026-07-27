"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoIosStar } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { useCart } from "../app/CartContext/CartContext";
import { useRouter } from "next/navigation";
import Home from "./pages/Home";
import Navbar from "./Components/Navbar";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const { addToCart, cartItems, addToWishlist } = useCart();
  const router = useRouter();

  // Add product to shopping cart
  // const handleAddToCart = (product) => {
  //   addToCart(product);
  //   localStorage.setItem("cartItems", JSON.stringify([...cartItems, product]));
  //   toast.success(
  //     <div>
  //       <span className="text-green-500">{product.name}</span> has been added to
  //       your cart!
  //     </div>,
  //     {
  //       position: "top-right",
  //       autoClose: 2000,
  //     }
  //   );
  // };

  // // Add product to Wishlist
  // const handleAddToWishlist = (product) => {
  //   addToWishlist(product);
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   const fetchProducts = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "products"));
  //       const productsData = querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setLoading(false);
  //       setProducts(productsData);
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

 

  // // (Auto Vertical Carousel)
  // const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % 4); // 3 لأن لدينا 3 عناصر فقط
  //   }, 2000); // تغيير كل ثانيتين

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="min-h-[44.5vh]">
      {/* {loading && (
        <div className="loading-overlay">
          <BarLoader color={"#d60096"} loading={loading} size={350} />
        </div>
      )} */}
      <Navbar />
      <div className="px-1">
      <Home/>
      </div>

      <div className=" text-gray-500 pl-1 my-2">
      <h3 id="products-section" className="text-gray-500">
        Trendy clothes
      </h3>
      </div>
      
      {/* 
      
      
      */}


    </div>
  );
};

export default page;