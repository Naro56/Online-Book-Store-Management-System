import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if this is a newly placed order
  const isNewOrder = location.state?.orderId === id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch the order from your API
        // const response = await axios.get(`/api/orders/${id}`);
        // setOrder(response.data);

        // For demo purposes, create a fake order
        setTimeout(() => {
          const demoOrder = {
            id: id || 'ORD-12345',
            date: new Date().toISOString(),
            status: 'Processing',
            items: [
              {
                id: 1,
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                price: 1299.00,
                quantity: 1,
                imageUrl: 'https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg'
              },
              {
                id: 2,
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                price: 1099.00,
                quantity: 2,
                imageUrl: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
              }
            ],
            shippingAddress: {
              fullName: `${currentUser?.username || 'John Doe'}`,
              address: '123 Main St',
              city: 'Anytown',
              state: 'NY',
              zipCode: '12345',
              country: 'India'
            },
            subtotal: 3499.97,
            tax: 350.00,
            total: 3849.97
          };
          setOrder(demoOrder);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, currentUser]);

  // Calculate order summary
  const calculateOrderSummary = () => {
    if (!order) return {};
    return {
      subtotalValue: order.subtotal,
      taxValue: order.tax,
      totalValue: order.total
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
          Return to Homepage
        </Link>
      </div>
    );
  }

  const { subtotalValue, taxValue, totalValue } = calculateOrderSummary();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {isNewOrder && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Thank you for your order!</p>
          <p>Your order has been successfully placed and will be processed shortly.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <div className="text-gray-600">
          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Order Status: <span className="text-blue-600">{order.status}</span></h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
              <address className="not-italic">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Order Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{subtotalValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>₹{taxValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t mt-2">
                  <span>Total:</span>
                  <span>₹{totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-12 flex-shrink-0">
                          <img
                            className="h-full w-full object-cover"
                            src={item.imageUrl}
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          to="/profile"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
        >
          View All Orders
        </Link>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;