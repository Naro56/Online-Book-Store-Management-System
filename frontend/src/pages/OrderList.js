import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';

const OrderList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add a refresh counter to force refresh
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Function to refresh orders
  const refreshOrders = () => {
    setRefreshCounter(prev => prev + 1);
  };

  // Set up an interval to refresh orders every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshOrders();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setLoading(true);

      // Always check localStorage first for the most up-to-date orders
      // (since admin updates are saved there)
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        console.log('Orders from localStorage:', storedOrders);

        // Show all orders for simplicity in this demo
        // In a real app, you would filter by user ID
        if (storedOrders.length > 0) {
          setOrders(storedOrders);
          setLoading(false);
        }
      } catch (localErr) {
        console.error('Error fetching from localStorage:', localErr);
      }

      // Try to fetch orders from API as well
      try {
        // Fetch orders from API
        const response = await userAPI.getOrders();
        console.log('Orders from API:', response.data);

        // If we got orders from API, use them
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        }
      } catch (apiErr) {
        console.error('Error fetching orders from API:', apiErr);
        // If API fails and we don't have orders yet, show error
        if (orders.length === 0) {
          setError('No orders found. Place an order to see it here!');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate, refreshCounter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // We'll show a friendly message instead of an error
  if (error && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">You haven't placed any orders yet</h2>
          <p className="text-gray-600 mb-6">
            Browse our collection and find your next favorite book!
          </p>
          <Link
            to="/books"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">You haven't placed any orders yet</h2>
          <p className="text-gray-600 mb-6">
            Browse our collection and find your next favorite book!
          </p>
          <Link
            to="/books"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : parseFloat(order.totalAmount).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
