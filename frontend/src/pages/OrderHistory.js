import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try again later.');

        // Set demo data for development
        setDemoData();
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper function to set demo data
  const setDemoData = () => {
    // Start with an empty order list
    setOrders([]);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">{error}</h2>
        <button
          className="mt-4 btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to add orders to your history.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="card overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                  <Link to={`/orders/${order.id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>

              <div className="divide-y">
                {order.items.map(item => (
                  <div key={item.id} className="p-4 flex items-center">
                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden mr-4">
                      <img
                        src={`https://via.placeholder.com/150?text=${encodeURIComponent(item.title)}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="ml-4">
                      <Link to={`/books/${item.bookId}`} className="text-primary-600 hover:text-primary-800 text-sm">
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total:</span>
                <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;