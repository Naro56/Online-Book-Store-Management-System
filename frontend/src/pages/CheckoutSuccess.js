import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import confetti from 'canvas-confetti';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Get order info from state, if available
  const orderId = location.state?.orderId;
  const totalAmount = location.state?.totalAmount;
  
  // If there's no order info in the state, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
    
    // Clear the cart when the component mounts
    // (This is a safety measure in case the cart wasn't cleared during checkout)
    clearCart();

    // Launch confetti celebration effect
    if (orderId) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min, max) => {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        
        // Launch confetti from left and right sides
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0 },
          colors: ['#5046e4', '#f43f5e', '#0ea5e9']
        });
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 1 },
          colors: ['#5046e4', '#f43f5e', '#0ea5e9']
        });
        
      }, 250);
    }
  }, [orderId, navigate, clearCart]);

  // If we don't have an order ID (and before redirect happens), show loading
  if (!orderId) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto py-16 px-4 text-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100 rounded-full opacity-40 translate-x-1/3 translate-y-1/3 z-0"></div>
      
      <div className="relative bg-white rounded-lg shadow-xl p-8 z-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-800">Order Confirmed!</h1>
        <div className="w-16 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
        
        <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto">
          Thank you for your purchase. Your order has been successfully placed and is now being processed.
        </p>

        <div className="mb-8 mx-auto max-w-md bg-gray-50 p-6 rounded-lg text-left shadow-md">
          <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
            <span className="font-medium text-gray-600">Order Number:</span>
            <span className="font-bold text-blue-700">{orderId}</span>
          </div>
          
          {totalAmount && (
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Total Amount:</span>
              <span className="font-bold text-green-600">₹{totalAmount}</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left max-w-lg mx-auto rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                A confirmation email has been sent to your email address. 
                You can track your order status in your account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to={`/orders/${orderId}`} 
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Order Details
          </Link>
          <Link 
            to="/" 
            className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
      
      {/* Recommended next steps */}
      <div className="mt-12 relative z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Track Your Order</h3>
            <p className="text-gray-600 text-sm">
              Follow the progress of your order and get updates on shipping.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Review Purchase</h3>
            <p className="text-gray-600 text-sm">
              After receiving your books, come back to share your thoughts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Explore More</h3>
            <p className="text-gray-600 text-sm">
              Discover more books based on your purchase history and preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Animated book illustrations */}
      <div className="absolute -left-8 top-1/4 transform -translate-y-1/2 hidden lg:block">
        <div className="w-24 h-32 bg-blue-600 rounded-md shadow-lg transform -rotate-12 opacity-80"></div>
      </div>
      <div className="absolute -right-8 bottom-1/4 transform translate-y-1/2 hidden lg:block">
        <div className="w-24 h-32 bg-green-600 rounded-md shadow-lg transform rotate-12 opacity-80"></div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;