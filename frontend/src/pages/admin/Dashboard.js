import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { mockBooks } from '../../data/mockData';
import { mockUsers, mockOrders } from '../../data/mockUsers';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [],
    topSellingBooks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, this would call the API
        // const response = await axios.get('/api/admin/dashboard');
        // setStats(response.data);

        // For demo purposes, we'll use mock data
        setDemoData();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to set demo data
  const setDemoData = () => {
    // Calculate total revenue from all orders
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    setStats({
      totalBooks: mockBooks.length,
      totalOrders: mockOrders.length,
      totalRevenue: totalRevenue,
      totalUsers: mockUsers.length,
      // Get the 5 most recent orders
      recentOrders: mockOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customer: order.customer.name,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        })),
      // Calculate top selling books based on orders
      topSellingBooks: (() => {
        // Create a map to track book sales
        const bookSales = {};

        // Process all order items
        mockOrders.forEach(order => {
          order.items.forEach(item => {
            if (!bookSales[item.bookId]) {
              bookSales[item.bookId] = {
                id: item.bookId,
                title: item.title,
                author: item.author,
                revenue: 0,
                copies: 0
              };
            }
            bookSales[item.bookId].revenue += item.price * item.quantity;
            bookSales[item.bookId].copies += item.quantity;
          });
        });

        // Convert to array and sort by revenue
        return Object.values(bookSales)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      })()
    });
  };

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
      <div>
        <h1 className="text-2xl font-bold mb-8 px-4 py-4">Admin Dashboard</h1>

        <div className="text-center py-16">
          <p className="text-red-600 mb-4">Failed to load dashboard data. Please try again later.</p>
          <button
            className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="mt-4 md:mt-0 space-x-2">
          <Link to="/admin/books/create" className="btn btn-primary">
            Add New Book
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-white border-l-4 border-primary-500">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Books</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
              <div className="p-3 rounded-full bg-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link to="/admin/books" className="text-sm text-primary-600 hover:text-primary-800">
                View all books
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-white border-l-4 border-green-500">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link to="/admin/reports" className="text-sm text-green-600 hover:text-green-800">
                View reports
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-white border-l-4 border-blue-500">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
                View all orders
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-white border-l-4 border-purple-500">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link to="/admin/users" className="text-sm text-purple-600 hover:text-purple-800">
                View all users
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No orders yet</div>
            ) : (
              stats.recentOrders.map(order => (
                <div key={order.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Link to={`/admin/orders/${order.id}`} className="font-medium hover:text-primary-600">
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      <p className="text-sm text-gray-500">Customer: {order.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">{order.customer}</p>
                    <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <Link to="/admin/orders" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View all orders
            </Link>
          </div>
        </div>

        {/* Top Selling Books */}
        <div className="card">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">Top Selling Books</h2>
          </div>
          <div className="divide-y">
            {stats.topSellingBooks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No sales data yet</div>
            ) : (
              stats.topSellingBooks.map(book => (
                <div key={book.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/admin/books/${book.id}`} className="font-medium hover:text-primary-600">
                        {book.title}
                      </Link>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{book.revenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{book.copies} copies</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <Link to="/admin/reports/sales" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              View sales report
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Quick Actions</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/books/create" className="card bg-primary-50 hover:bg-primary-100 p-4 flex flex-col items-center justify-center text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="mt-2 font-medium text-primary-700">Add New Book</span>
          </Link>

          <Link to="/admin/categories/create" className="card bg-blue-50 hover:bg-blue-100 p-4 flex flex-col items-center justify-center text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="mt-2 font-medium text-blue-700">Add Category</span>
          </Link>

          <Link to="/admin/orders" className="card bg-green-50 hover:bg-green-100 p-4 flex flex-col items-center justify-center text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="mt-2 font-medium text-green-700">Manage Orders</span>
          </Link>

          <Link to="/admin/reports" className="card bg-purple-50 hover:bg-purple-100 p-4 flex flex-col items-center justify-center text-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="mt-2 font-medium text-purple-700">View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;