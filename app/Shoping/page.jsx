"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { useCart } from "../CartContext/CartContext";
import ProtectedRoute from "../ProtectedRoute/page";

export default function ShoppingCart() {
  // loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();

  // Calculate the total cost of all products
  const totalCost = cartItems.reduce(
    (total, product) => total + parseFloat(product.price) * product.quantity,
    0
  );
  return (
    <ProtectedRoute>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="loading-overlay">
            <BarLoader color={"#d60096"} loading={loading} size={350} />
          </div>
        )}
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 sm:p-8 my-3">
          <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
            Shopping Cart
          </h1>

          <div className="flex flex-col lg:flex-row">
            {/*  Invoice */}
            <div className="w-full lg:w-2/3 pr-0 lg:pr-8 mb-8 lg:mb-0">
              <div className="flex justify-between border-b pb-4 mb-4">
                <span className="text-lg font-semibold">
                  {cartItems.length} Items
                </span>
              </div>

              {/* products */}
              <div className="space-y-6">
                {cartItems.map((product) => (
                  <div
                    className="flex items-center justify-between sm:gap-6 border-b pb-4"
                    key={product.id}
                  >
                    {/*   photos & info  */}
                    <div className="flex items-center space-x-4 w-1/2">
                      <img
                        className="rounded w-20 h-20 object-cover"
                        src={product.imageUrls?.[0] || "/placeholder.png"}
                        alt={product.name}
                      />
                      <div className="text-left">
                        <p className="font-semibold">{product.name}</p>
                        <span className="text-gray-500 text-sm">
                          {product.category}
                        </span>
                        <p
                          className="text-blue-500 cursor-pointer text-sm mt-1"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </p>
                      </div>
                    </div>

                    {/* buttons */}
                    <div className="flex items-center gap-2 w-1/4 justify-center">
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded"
                        onClick={() => decreaseQuantity(product.id)}
                      >
                        -
                      </button>
                      <span className="font-semibold w-4 text-center">
                        {product.quantity}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded"
                        onClick={() => increaseQuantity(product.id)}
                      >
                        +
                      </button>
                    </div>

                    {/* price */}
                    <span className="w-1/4 text-right text-gray-600 font-semibold">
                      £{product.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary section */}
            <div className="w-full lg:w-1/3 bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-center lg:text-left">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span>ITEMS </span>
                <span>£{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                {/* <span>SHIPPING</span> */}
                <span>Standard Delivery</span>
                <span>£5.00</span>
              </div>
              <div className="mb-4">
                <label className="text-gray-600">PROMO CODE</label>
                <input
                  type="text"
                  placeholder="Enter your code"
                  className="w-full p-2 border rounded mt-1"
                />
                <button className="w-full mt-2 p-2 bg-pink-500 hover:bg-pink-600 text-white rounded ml-1">
                  APPLY
                </button>
              </div>
              <div className="flex justify-between mb-4 font-semibold">
                <span>TOTAL COST</span>
                <span>£{(totalCost + 5).toFixed(2)}</span>
              </div>
              <Link href="/Shoping/Payment">
                <button className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 ml-1">
                  CHECKOUT
                </button>
              </Link>
            </div>
          </div>

          <Link href="../Wishlist">
            <p className="mt-4 text-blue-500 cursor-pointer lg:text-left">
              ← Continue Wishlist
            </p>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
