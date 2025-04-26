import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    // Shipping info
    fullName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    address: '',
    notes: ''
  });

  // Load user address if available
  useEffect(() => {
    if (currentUser) {
      // Format the address properly if it's an object
      let formattedAddress = '';
      if (currentUser.address && typeof currentUser.address === 'object') {
        const addr = currentUser.address;
        formattedAddress = `${addr.street}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
      } else if (currentUser.address) {
        formattedAddress = currentUser.address;
      }

      setFormData(prev => ({
        ...prev,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        address: formattedAddress
      }));
    }
  }, [currentUser]);

  // Validation
  const [errors, setErrors] = useState({});

  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  // Validate shipping information
  const validateShippingInfo = () => {
    const newErrors = {};
    // Only require name and email, address can be empty for now
    const requiredFields = ['fullName', 'email'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Just log a warning if address is missing
    if (!formData.address) {
      console.warn('Proceeding with order despite missing address');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate shipping cost (free for orders over ₹500)
  const shippingCost = totalPrice > 500 ? 0 : 50;
  const totalAmount = totalPrice + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Order submission started');

    if (!validateShippingInfo()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);

    try {
      console.log('Processing order...');

      // Create order object for API
      const orderData = {
        userId: currentUser?.id,
        shippingAddress: formData.address,
        totalAmount: totalAmount,
        orderItems: cart.map(item => ({
          bookId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log('Order data prepared:', orderData);

      let savedOrder;

      // Try to send order to backend API
      try {
        const response = await ordersAPI.create(orderData);
        savedOrder = response.data;
        console.log('Order saved to database:', savedOrder);
        setOrderId(savedOrder.id.toString());
      } catch (apiError) {
        console.error('API error, falling back to localStorage:', apiError);

        // Generate a fake order ID for localStorage
        const generatedOrderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
        setOrderId(generatedOrderId);

        // Create order object for localStorage
        const localOrder = {
          id: Date.now(),
          orderNumber: generatedOrderId,
          userId: currentUser?.id || 'guest-user',
          customer: {
            id: currentUser?.id || 'guest-user',
            name: formData.fullName,
            email: formData.email,
            address: formData.address
          },
          items: cart.map((item, index) => ({
            id: index + 1,
            bookId: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            isbn: item.isbn || ''
          })),
          totalAmount: totalAmount,
          status: 'PENDING',
          paymentMethod: 'Credit Card',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          shippingAddress: formData.address,
          notes: formData.notes,
          trackingNumber: null
        };

        // Store order in localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(localOrder);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        console.log('Order saved to localStorage as fallback');
        savedOrder = localOrder;
      }

      // Clear cart after successful order
      clearCart();
      console.log('Cart cleared');

      // Show success message
      setShowSuccess(true);
      setLoading(false);
      console.log('Order completed successfully');

      // No automatic redirect - user can choose what to do next
    } catch (error) {
      console.error('Error processing order:', error);
      setErrors({
        submit: 'There was an error processing your order. Please try again.'
      });
      setLoading(false);
    }
  };

  // Shipping cost calculation moved up before handleSubmit

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-4">Your order ID is: {orderId}</p>
              <p className="text-gray-600 mb-4">Your books will be delivered to your address soon.</p>
              <p className="text-gray-600 mb-4">You can check the status of your order in the <strong>Order History</strong> page.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    navigate('/orders');
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  View Order History
                </button>
                <button
                  onClick={() => {
                    navigate('/books');
                  }}
                  className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Shipping Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                    <p className="text-gray-700 mb-1">{formData.fullName}</p>
                    <p className="text-gray-700 mb-1">{formData.email}</p>

                    {formData.address ? (
                      <div>
                        <p className="text-gray-700">{formData.address}</p>
                        <button
                          type="button"
                          onClick={() => {
                            const newAddress = prompt('Enter your shipping address:', formData.address);
                            if (newAddress) {
                              setFormData({...formData, address: newAddress});
                            }
                          }}
                          className="text-blue-600 text-sm mt-2 hover:underline"
                        >
                          Edit Address
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700">No address provided</p>
                        <p className="text-yellow-500 text-sm mt-2">
                          No shipping address found. You can still place the order, but we recommend adding an address.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const newAddress = prompt('Enter your shipping address:');
                            if (newAddress) {
                              setFormData({...formData, address: newAddress});
                            }
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm mt-2 hover:bg-blue-700"
                        >
                          Add Address
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder="Special instructions for delivery, etc."
                    ></textarea>
                  </div>

                  {errors.submit && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {errors.submit}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
            </form>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <span className="text-gray-600 mr-2">{item.quantity}x</span>
                    <span>{item.title}</span>
                  </div>
                  <span>₹{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
