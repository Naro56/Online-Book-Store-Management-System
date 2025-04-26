import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userAPI } from '../services/api';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Set up axios headers with the token
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Try to fetch from API
        try {
          // Fetch user profile details
          const profileResponse = await userAPI.getProfile();
          setUserDetails(profileResponse.data);

          // Fetch user orders
          const ordersResponse = await userAPI.getOrders();
          setOrders(ordersResponse.data);
        } catch (apiError) {
          console.log('API error, using current user data as fallback', apiError);
          // Use currentUser as fallback if API fails
          setMockData();
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again later.');
        setLoading(false);

        // For development/demo purposes, set mock data
        setMockData();
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Set mock data for development/demo purposes
  const setMockData = () => {
    // Use currentUser data if available, otherwise use default values
    if (currentUser) {
      setUserDetails({
        id: currentUser.id || 1,
        username: currentUser.username || 'user1',
        email: currentUser.email || 'user@example.com',
        fullName: currentUser.displayName || currentUser.fullName || 'John Doe',
        address: currentUser.address || '42/B, Nehru Nagar, Mumbai, Maharashtra 400076, India',
        phoneNumber: currentUser.phoneNumber || '+91 9876543210'
      });
    } else {
      setUserDetails({
        id: 1,
        username: 'user1',
        email: 'user@example.com',
        fullName: 'John Doe',
        address: '42/B, Nehru Nagar, Mumbai, Maharashtra 400076, India',
        phoneNumber: '+91 9876543210'
      });
    }

    // No mock orders - start with empty order history
    setOrders([]);

    // Clear any error since we're showing mock data
    setError(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading your profile...</h2>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* User Profile Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <button
            onClick={() => navigate('/profile/edit')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {userDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                <p className="text-lg font-medium">{userDetails.fullName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="text-lg font-medium">{userDetails.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-lg font-medium">{userDetails.email}</p>
              </div>
            </div>
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-lg font-medium">{userDetails.address || 'No address provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-lg font-medium">{userDetails.phoneNumber || 'No phone number provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order History Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">When you place orders, they will appear here.</p>
            <Link to="/books" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                    <Link to={`/orders/${order.id}`} className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </Link>
                  </div>
                </div>

                <div className="mt-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <p className="text-sm font-medium">Items ({order.orderItems.length})</p>
                  </div>
                  <div className="divide-y">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center">
                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                          <img
                            src={`https://via.placeholder.com/150?text=${encodeURIComponent(item.bookTitle)}`}
                            alt={item.bookTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150?text=Book+Image';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.bookTitle}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium mt-1">{formatCurrency(item.price)} each</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
                          <Link to={`/books/${item.bookId}`} className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block">
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <p className="text-gray-500">Shipped to: <span className="font-medium">{order.shippingAddress || 'N/A'}</span></p>
                  <p className="text-lg font-bold">Total: {formatCurrency(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;