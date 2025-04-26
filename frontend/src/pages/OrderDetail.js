import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getBookImageUrl } from '../utils/imageUtils';
import { ordersAPI } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add a refresh counter to force refresh
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to refresh order details
  const refreshOrderDetails = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // Set up an interval to refresh order details every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOrderDetails();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      if (!loading) {
        setLoading(true);
      }

      // Always check localStorage first for the most up-to-date order
      // (since admin updates are saved there)
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        console.log('Orders from localStorage:', storedOrders);
        console.log('Looking for order with ID:', id);

        // Try to find the order by ID or orderNumber
        const foundOrder = storedOrders.find(o =>
          o.id === parseInt(id) ||
          o.id === id ||
          o.orderNumber === id
        );

        console.log('Found order in localStorage:', foundOrder);

        if (foundOrder) {
          // For demo purposes, show all orders regardless of user ID
          setOrder(foundOrder);
          setLoading(false);
        }
      } catch (localErr) {
        console.error('Error fetching from localStorage:', localErr);
      }

      // Try to fetch order from API as well
      try {
        // Fetch order details from API
        const response = await ordersAPI.getById(id);
        console.log('Order from API:', response.data);

        // If we got order from API, use it
        if (response.data) {
          setOrder(response.data);
        }
      } catch (apiErr) {
        console.error('Error fetching order details from API:', apiErr);
        // If API fails and we don't have order yet, show error
        if (!order) {
          setError('Order not found. Please check the order ID and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, currentUser, navigate, refreshCounter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">{error}</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/orders')}
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">Order not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => navigate('/orders')}
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge color
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
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status description
  const getStatusDescription = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'Your order has been delivered.';
      case 'SHIPPED':
        return 'Your order has been shipped and is on the way.';
      case 'PROCESSING':
        return 'Your order is being processed and will be shipped soon.';
      case 'CANCELLED':
        return 'Your order has been cancelled.';
      case 'PENDING':
        return 'Your order is pending confirmation.';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="mt-4 md:mt-0">
          <Link
            to="/orders"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to My Orders
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Order Status</h3>
            <p className="text-gray-700">{getStatusDescription(order.status)}</p>

            {order.status === 'SHIPPED' && order.trackingNumber && (
              <div className="mt-4">
                <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
                <p className="text-sm text-gray-600 mt-1">
                  You can track your package using this number on the courier's website.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p className="mb-1">{typeof order.shippingAddress === 'object' ?
                `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` :
                order.shippingAddress}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
              <p className="mb-1"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
              <p className="mb-1"><span className="font-medium">Payment Status:</span> Paid</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-16 w-12 flex-shrink-0 mr-4">
                            <img
                              src={getBookImageUrl({
                                title: item.title,
                                author: item.author,
                                isbn: item.isbn,
                                imageUrl: item.imageUrl
                              })}
                              alt={item.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/300x400/3949ab/ffffff?text=${encodeURIComponent(item.title)}\nby ${encodeURIComponent(item.author)}`;
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Subtotal:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : parseFloat(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Shipping:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ₹0.00
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : parseFloat(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.status === 'DELIVERED' && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-700 mb-4">
                If you have any issues with your order, please contact our customer support.
              </p>
              <Link
                to="/contact"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors inline-block"
              >
                Contact Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
