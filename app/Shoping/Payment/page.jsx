"use client";
import React from "react";
import Link from "next/link";
import { useCart } from '../../CartContext/CartContext';
import ProtectedRoute from "../../ProtectedRoute/page";

export default function PaymentPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  // Calculate the total cost
  const totalCost = cartItems.reduce((total, product) => total + parseFloat(product.price) * product.quantity, 0);
  const shippingCost = 5;
  const finalTotal = totalCost + shippingCost;

  return (
    <ProtectedRoute>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full md:w-4/5 bg-white shadow-lg rounded-lg p-4 md:p-8 flex flex-col md:flex-row">
        {/* Shopping Bag Section */}
        <div className="w-full md:w-3/5 pr-0 md:pr-8 md:border-r mb-6 md:mb-0">
          <h1 className="text-2xl font-bold mb-6">Shopping Bag</h1>

          {/* Cart Items */}
          <div className="space-y-6">
            {cartItems.map((product) => (
              <div className="flex justify-between items-center mb-4" key={product.id}>
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageUrls?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-32 h-32 rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm text-gray-500">Size: {product.size || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Color: {product.color || 'N/A'}</p>
                    <p className="text-lg font-semibold mt-2">£{product.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="w-8 h-8 flex items-center justify-center border rounded" onClick={() => decreaseQuantity(product.id)}>-</button>
                  <span className="font-semibold w-4 text-center">{product.quantity}</span>
                  <button className="w-8 h-8 flex items-center justify-center border rounded" onClick={() => increaseQuantity(product.id)}>+</button>
                  <button onClick={() => removeFromCart(product.id)} className="text-blue-500 cursor-pointer text-sm ml-4">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6">
            <p className="text-gray-500">Subtotal: £{totalCost.toFixed(2)}</p>
            <p className="text-gray-500">Shipping: €{shippingCost.toFixed(2)}</p>
            <p className="text-lg font-semibold">Total: €{finalTotal.toFixed(2)}</p>
          </div>
          <Link href="/Shoping">
            <p className="mt-4 text-blue-500 cursor-pointer lg:text-left">← Continue Shopping</p>
          </Link>
        </div>

        {/* Payment Details Section */}
        <div className="w-full md:w-2/5 pl-0 md:pl-8">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-500">Card Type</label>
              <div className="flex items-center mt-2">
                <img src="/image/MastarCard.png" alt="MasterCard" className="w-10 h-6 mr-2" />
                <span>MasterCard</span>
              </div>
            </div>
            <div>
              <label className="text-gray-500">Cardholder Name</label>
              <input type="text" placeholder="Alice Connolly" className="w-full p-2 border rounded mt-1" />
            </div>
            <div>
              <label className="text-gray-500">Card Number</label>
              <input type="text" placeholder="4555 6799 3389 9876" className="w-full p-2 border rounded mt-1" />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="text-gray-500">Expiry Date</label>
                <input type="text" placeholder="07/2023" className="w-full p-2 border rounded mt-1" />
              </div>
              <div className="w-1/2">
                <label className="text-gray-500">CVV Number</label>
                <input type="text" placeholder="321" className="w-full p-2 border rounded mt-1" />
              </div>
            </div>
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-10 text-lg rounded-lg mt-4 ml-1">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}