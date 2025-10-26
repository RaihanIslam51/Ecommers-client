"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('bdmart_cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
    return [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('bdmart_wishlist');
      if (savedWishlist) {
        try {
          return JSON.parse(savedWishlist);
        } catch (error) {
          console.error('Error loading wishlist:', error);
        }
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('bdmart_cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('bdmart_cart');
    }
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (wishlistItems.length > 0) {
      localStorage.setItem('bdmart_wishlist', JSON.stringify(wishlistItems));
    } else {
      localStorage.removeItem('bdmart_wishlist');
    }
  }, [wishlistItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item._id === product._id);
      if (exists) {
        return prevItems; // Already in wishlist
      }
      return [...prevItems, product];
    });
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getCartTotal,
    getCartItemCount,
    cartCount: getCartItemCount(),
    wishlistCount: wishlistItems.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
