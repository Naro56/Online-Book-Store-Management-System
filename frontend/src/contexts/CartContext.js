import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context for Cart
const CartContext = createContext();

// Hook to use the cart context
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing cart from localStorage:', err);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Update localStorage and calculate totals when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Calculate totals
    const items = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(items);
    setTotalPrice(price);
  }, [cart]);

  // Add item to cart
  const addToCart = (book, quantity = 1) => {
    if (!book) return;
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === book.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // New item, add to cart
        return [...prevCart, {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          imageUrl: book.imageUrl,
          quantity: quantity
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (bookId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== bookId));
  };

  // Update item quantity
  const updateQuantity = (bookId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 