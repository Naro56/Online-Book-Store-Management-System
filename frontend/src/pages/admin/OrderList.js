import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Fetch orders from API
        console.log('Fetching orders from API, page:', currentPage);
        const response = await adminAPI.getAllOrders(currentPage - 1, 10);
        console.log('API response:', response.data);

        // Handle different response formats
        let content, apiTotalPages, totalElements;

        if (Array.isArray(response.data)) {
          // API returned an array directly
          content = response.data;
          apiTotalPages = 1;
          totalElements = content.length;
        } else {
          // API returned a Page object
          ({ content, totalPages: apiTotalPages, totalElements } = response.data);
        }

        // Format orders for display
        const formattedOrders = content.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          customer: {
            id: order.userId,
            name: order.username || 'Customer',
            email: order.email || 'customer@example.com'
          },
          totalAmount: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
          status: order.status,
          createdAt: order.orderDate || order.createdAt,
          items: order.orderItems ? order.orderItems.length : 0,
          paymentMethod: order.paymentMethod || 'Credit Card'
        }));

        // Apply filters client-side
        let filteredOrders = formattedOrders;
        if (searchTerm || statusFilter || dateRange.start || dateRange.end) {
          filteredOrders = formattedOrders.filter(order => {
            // Search filter
            if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return false;
            }

            // Status filter
            if (statusFilter && order.status !== statusFilter) {
              return false;
            }

            // Date range filter (simplified for demo)
            // In a real app, you would parse the dates and compare them properly

            return true;
          });
        }

        setOrders(filteredOrders);
        setTotalPages(apiTotalPages || 1);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');

        // Fallback to localStorage if API fails
        setDemoData();
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, searchTerm, statusFilter, dateRange]);

  // Helper function to set demo data
  const setDemoData = () => {
    // Import mock orders from data file
    import('../../data/mockUsers').then(({ mockOrders }) => {
      console.log('Using mock orders data:', mockOrders);

      // Process the orders to match the expected format
      const demoOrders = mockOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          id: order.customer.id,
          name: order.customer.name,
          email: order.customer.email
        },
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.length,
        paymentMethod: order.paymentMethod
      }));

      setOrders(demoOrders);
      setTotalPages(1);
    }).catch(err => {
      console.error('Error loading mock data:', err);
      // Fallback to empty array if mock data fails
      setOrders([]);
      setTotalPages(1);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('Updating order status to:', newStatus);
      console.log('Order ID:', orderId);

      // Try to call API to update order status
      try {
        const response = await adminAPI.updateOrderStatus(orderId, newStatus);
        console.log('API response:', response.data);
      } catch (apiErr) {
        console.error('API error when updating order status:', apiErr);
        // Continue with localStorage update even if API fails
      }

      // Update the local state
      setOrders(
        orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Always update in localStorage
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = storedOrders.map(order => {
          if (order.id === orderId || order.id === orderId.toString() || order.orderNumber === orderId) {
            return {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
          }
          return order;
        });

        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        console.log('Updated localStorage with new order status');
      } catch (localErr) {
        console.error('Error updating localStorage:', localErr);
      }

      // Show success message
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error in update order status process:', err);
      alert('Failed to update order status. Please try again later.');
    }
  };

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

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && orders.length === 0) {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Order Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              className="border border-gray-300 rounded px-3 py-2 w-64"
              placeholder="Order # or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="border border-gray-300 rounded px-3 py-2 w-40"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-32"
                placeholder="dd-mm-yyyy"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2 w-32"
                placeholder="dd-mm-yyyy"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSearch}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No orders found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : parseFloat(order.totalAmount).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                        <div className="relative inline-block text-left dropdown">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.currentTarget.nextElementSibling.classList.toggle('hidden');
                            }}
                            aria-haspopup="true"
                          >
                            Update
                          </button>
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {order.status !== 'PROCESSING' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Mark as Processing
                                </button>
                              )}
                              {order.status !== 'SHIPPED' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Mark as Shipped
                                </button>
                              )}
                              {order.status !== 'DELIVERED' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Mark as Delivered
                                </button>
                              )}
                              {order.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`btn btn-sm ${currentPage === 1 ? 'btn-disabled' : 'btn-primary'}`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`btn btn-sm ${currentPage === totalPages ? 'btn-disabled' : 'btn-primary'}`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`btn-pagination rounded-l-md ${currentPage === 1 ? 'btn-pagination-disabled' : ''}`}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`btn-pagination ${currentPage === 1 ? 'btn-pagination-disabled' : ''}`}
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`btn-pagination ${currentPage === pageNum ? 'bg-primary-50 text-primary-600' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`btn-pagination ${currentPage === totalPages ? 'btn-pagination-disabled' : ''}`}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`btn-pagination rounded-r-md ${currentPage === totalPages ? 'btn-pagination-disabled' : ''}`}
                >
                  Last
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;