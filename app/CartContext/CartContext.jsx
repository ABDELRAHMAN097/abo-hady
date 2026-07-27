"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load cart items and wishlist items from localStorage on mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
    const storedWishlistItems = JSON.parse(localStorage.getItem('wishlistItems'));

    if (storedCartItems) setCartItems(storedCartItems);
    if (storedWishlistItems) setWishlistItems(storedWishlistItems);
  }, []);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

  // Update localStorage whenever wishlistItems change
  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    } else {
      localStorage.removeItem('wishlistItems');
    }
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.error(
      <div>removed one item</div>,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  };

  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      if (!prevItems.find((item) => item.id === product.id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
    toast.success("Added to wishlist");
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id);
      console.log("After remove:", updatedItems); // هنا بنطبع بعد التحديث مباشرة
      return updatedItems;
    });
    toast.error("Removed from wishlist");
  };
  

  const increaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, wishlistItems, addToWishlist, removeFromWishlist }}>
      {children}
    </CartContext.Provider>
  );
};




