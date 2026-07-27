"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { GiShoppingCart } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { useCart } from "../CartContext/CartContext.jsx";
import { FaRegHeart } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import Link from "next/link";

export default function MenProductsPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); 
  const { addToWishlist } = useCart();

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
  };

  useEffect(() => {
    setLoading(true);
    const fetchMenProducts = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("category", "==", "Men")
        );
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLoading(false);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching men's products:", error);
        setLoading(false);
      }
    };
    fetchMenProducts();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 4); // 3 لأن لدينا 3 عناصر فقط
    }, 2000); // تغيير كل ثانيتين

    return () => clearInterval(interval);
  }, []);
  

  return (
     <div className="min-h-[44.5vh]">
      {loading && (
        <div className="loading-overlay">
          <BarLoader color={"#d60096"} loading={loading} size={350} />
        </div>
      )}

      <h3 id="products-section" className="ml-5 my-5 text-gray-500">
        Men`s clothes
      </h3>
      <div>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products found ... !</p>
        ) : (
          <div className="grid grid-cols-2 gap-1 px-2 md:px-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 place-items-center">
            {products.map((product) => {
              const discountAmount = (product.price * product.discount) / 100;
              const newPrice = product.price - discountAmount;
              return (
                <Link href={`/DetailsProduct/${product.id}`} key={product.id}>
                  <div className="border relative my-2 w-full md:w-48 block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark min-h-[363px] md:min-h-[230px] cursor-pointer"
                  >
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
                        className="text-gray-800 font-normal text-sm leading-none mb-1 overflow-hidden text-ellipsis line-clamp-2"
                      >
                        {product.description}
                      </h2>
                      <p className="text-gray-600 font-semibold flex items-center justify-end gap-2 text-right w-full">
                        <span className="bg-pink-500 text-[12px] text-white text-sm px-[2px] py-[2px] rounded">
                          -{product.discount}%
                        </span>
                        <div className="flex flex-row text-green-400 text-[12px] font-bold">
                         <p className="mr-1">جنيه</p>
                         <p>{newPrice.toFixed(2)}</p>
                        </div>
                        <span className="line-through text-[12px] text-gray-400">
                        {parseFloat(product.price).toFixed(2)}
                        </span>
                      </p>
                      <p className="absolute top-[-18px] right-1 text-pink-500 flex items-center text-[14px] font-light">
                        {product.rating} <IoIosStar className="text-[14px]" />
                      </p>
                      {/* Auto Vertical Carousel */}
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
                                className="flex items-center justify-end text-right gap-1"
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
                                className="flex items-center justify-end text-right gap-1"
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
                      onClick={() => handleAddToWishlist(product)}
                    >
                      <FaRegHeart />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
