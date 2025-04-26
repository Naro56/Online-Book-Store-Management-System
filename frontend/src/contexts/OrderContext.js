import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserOrders } from '../api'; // Adjust this import based on your API structure

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await fetchUserOrders(); // Fetch orders from your API
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    loadOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  return useContext(OrderContext);
};
