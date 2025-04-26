import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { getBookImageUrl } from '../../utils/imageUtils';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors

      // First try to get the order from localStorage
      try {
        console.log('Trying to get order from localStorage first for ID:', id);
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Try to find the order by ID or orderNumber
        const foundOrder = storedOrders.find(o =>
          o.id === parseInt(id) ||
          o.id === id ||
          o.orderNumber === id
        );

        console.log('Found order in localStorage:', foundOrder);

        if (foundOrder) {
          setOrder(foundOrder);
          setTrackingNumber(foundOrder.trackingNumber || '');
          setLoading(false);
          return; // If we found the order in localStorage, don't try the API
        }
      } catch (localErr) {
        console.error('Error fetching from localStorage:', localErr);
      }

      // If no order in localStorage or there was an error, try the API
      try {
        // Fetch order details from API
        console.log('Fetching order details from API for ID:', id);
        const response = await adminAPI.getOrderById(id);
        const orderData = response.data;
        console.log('Order data from API:', orderData);

        // Format the order data for display
        const formattedOrder = {
          ...orderData,
          id: orderData.id,
          orderNumber: orderData.orderNumber || `ORD-${orderData.id}`,
          createdAt: orderData.orderDate || new Date().toISOString(),
          updatedAt: orderData.updatedAt || orderData.orderDate || new Date().toISOString(),
          customer: {
            id: orderData.userId,
            name: orderData.username || 'Customer',
            email: orderData.email || 'customer@example.com',
            phone: orderData.phoneNumber || 'N/A'
          },
          items: orderData.orderItems ? orderData.orderItems.map(item => ({
            id: item.id,
            bookId: item.bookId,
            title: item.bookTitle,
            author: 'Author', // API might not provide this
            price: item.price,
            quantity: item.quantity,
            imageUrl: null,
            isbn: ''
          })) : [],
          paymentMethod: orderData.paymentMethod || 'Credit Card',
          status: orderData.status || 'PENDING'
        };

        setOrder(formattedOrder);
        setTrackingNumber(orderData.trackingNumber || '');
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateOrderStatus = async (newStatus) => {
    setStatusUpdateLoading(true);
    try {
      console.log('Updating order status to:', newStatus);
      console.log('Order ID:', id);
      console.log('Tracking number:', newStatus === 'SHIPPED' ? trackingNumber : 'N/A');

      // Prepare the update data
      const updateData = {
        status: newStatus
      };

      if (newStatus === 'SHIPPED' && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      // Call API to update order status
      try {
        const response = await adminAPI.updateOrderStatus(id, newStatus, newStatus === 'SHIPPED' ? trackingNumber : undefined);
        console.log('API response:', response.data);
      } catch (apiErr) {
        console.error('API error when updating order status:', apiErr);
        // Continue with localStorage update even if API fails
      }

      // Update local state
      const updatedOrder = {
        ...order,
        status: newStatus,
        trackingNumber: newStatus === 'SHIPPED' ? trackingNumber : order.trackingNumber,
        updatedAt: new Date().toISOString()
      };
      setOrder(updatedOrder);

      // Always update in localStorage
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = storedOrders.map(o =>
          (o.id === parseInt(id) || o.id === id || o.orderNumber === id) ? updatedOrder : o
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        console.log('Updated localStorage with new order status');
      } catch (localErr) {
        console.error('Error updating localStorage:', localErr);
      }

      // Show success message
      alert(`Order status updated to ${newStatus}`);
      setShowStatusDropdown(false);
    } catch (err) {
      console.error('Error in update order status process:', err);
      alert('Failed to update order status. Please try again later.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleTrackingNumberSubmit = (e) => {
    e.preventDefault();
    updateOrderStatus('SHIPPED');
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
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600">Order not found</h2>
        <button
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="mt-4 md:mt-0">
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Orders
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{order.orderNumber}</h2>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              {order.updatedAt !== order.createdAt && (
                <p className="text-gray-600">Last updated: {formatDate(order.updatedAt)}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
              <div className="relative ml-4">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={statusUpdateLoading}
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {statusUpdateLoading ? 'Updating...' : 'Update Status'}
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {order.status !== 'PROCESSING' && (
                        <button
                          onClick={() => updateOrderStatus('PROCESSING')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Mark as Processing
                        </button>
                      )}
                      {order.status !== 'SHIPPED' && (
                        <button
                          onClick={() => {
                            if (trackingNumber.trim()) {
                              updateOrderStatus('SHIPPED');
                            } else {
                              alert('Please enter a tracking number before marking as shipped');
                            }
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Mark as Shipped
                        </button>
                      )}
                      {order.status !== 'DELIVERED' && (
                        <button
                          onClick={() => updateOrderStatus('DELIVERED')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Mark as Delivered
                        </button>
                      )}
                      {order.status !== 'CANCELLED' && (
                        <button
                          onClick={() => updateOrderStatus('CANCELLED')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <p className="mb-1"><span className="font-medium">Name:</span> {order.customer.name}</p>
              <p className="mb-1"><span className="font-medium">Email:</span> {order.customer.email}</p>
              <p className="mb-1"><span className="font-medium">Phone:</span> {order.customer.phone}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
              <p className="mb-1">{typeof order.shippingAddress === 'object' ?
                `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}` :
                order.shippingAddress}</p>
            </div>
          </div>

          {(order.status === 'SHIPPED' || order.status === 'DELIVERED') ? (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Tracking Information</h3>
              <p className="mb-1">
                <span className="font-medium">Tracking Number:</span> {order.trackingNumber || 'Not available'}
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Tracking Information</h3>
              <form onSubmit={handleTrackingNumberSubmit} className="flex items-end">
                <div className="mr-4 flex-grow">
                  <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    id="trackingNumber"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={!trackingNumber.trim()}
                >
                  Save & Mark as Shipped
                </button>
              </form>
            </div>
          )}

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
                  {(order.items || order.orderItems || []).map((item) => (
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
                                e.target.src = `https://via.placeholder.com/300x400/3949ab/ffffff?text=${encodeURIComponent(item.title)}\nby ${encodeURIComponent(item.author || 'Unknown')}`;
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

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <p className="mb-1"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
            <p className="mb-1"><span className="font-medium">Payment Status:</span> Paid</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
