// ProductCard.js
"use client";
import { motion } from "framer-motion";
import { IoIosStar } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCart } from "../CartContext/CartContext";

const ProductCard = ({ product, currentIndex }) => {
  const { addToCart, cartItems, addToWishlist } = useCart();
  const router = useRouter();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    localStorage.setItem("cartItems", JSON.stringify([...cartItems, product]));
    toast.success(
      <div>
        <span className="text-green-500">{product.name}</span> has been added to your cart!
      </div>,
      { position: "top-right", autoClose: 2000 }
    );
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
  };

  const discountAmount = (product.price * product.discount) / 100;
  const newPrice = product.price - discountAmount;

  return (
    <div
      onClick={() => router.push(`/DetailsProduct/${product.id}`)}
      className="border relative my-2 mx-1 w-[300px] md:w-48 block rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark min-h-[363px] md:min-h-[230px] cursor-pointer"
    >
      <img className="rounded-t-lg w-full h-[250px] md:h-48 object-cover" src={product.imageUrls?.[0] || "/placeholder.png"} alt={product.name} />
      <div className="relative text-right p-2">
        <h2 className="text-gray-800 font-normal text-sm leading-none mb-1 py-1 overflow-hidden text-ellipsis line-clamp-2">{product.description}</h2>
        <p className="text-gray-600 font-semibold flex items-center justify-end gap-2">
          <span className="bg-pink-500 text-[12px] text-white px-[2px] py-[2px] rounded">-{product.discount}%</span>
          <div className="flex flex-row text-green-400 text-[12px] font-bold">
            <p className="mr-1">جنيه</p>
            <p>{newPrice.toFixed(2)}</p>
          </div>
          <span className="line-through text-[12px] text-gray-400">{parseFloat(product.price).toFixed(2)}</span>
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
                <span key="fast-selling" className="flex items-center justify-end gap-1">بتخلص بسرعة <GiShoppingCart className="text-pink-500" /></span>,
                <span key="stock" className="text-[14px]">{product.stock} عدد القطع المتاحة</span>,
                <span key="discount" className="text-[14px] text-green-400">{product.brand}</span>,
                <span key="delivery" className="flex items-center justify-end gap-1">توصيل مجاني <TbTruckDelivery className="text-pink-500" /></span>,
              ][currentIndex]
            }
          </motion.div>
        </div>
      </div>
      <button className="absolute left-1 top-1 text-gray-500 bg-white rounded p-1" onClick={handleAddToWishlist}><FaRegHeart /></button>
      <button className="absolute left-10 top-1 text-gray-500 bg-white rounded p-1" onClick={handleAddToCart}><GiShoppingCart className="text-pink-500" /></button>
    </div>
  );
};

export default ProductCard;
