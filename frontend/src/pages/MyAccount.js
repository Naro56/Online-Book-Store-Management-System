// src/pages/MyAccount.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Helper function to get color based on order status
const getStatusColor = (status) => {
    switch (status) {
        case 'PROCESSING':
            return 'bg-yellow-100 text-yellow-800';
        case 'SHIPPED':
            return 'bg-blue-100 text-blue-800';
        case 'DELIVERED':
            return 'bg-green-100 text-green-800';
        case 'CANCELLED':
            return 'bg-red-100 text-red-800';
        case 'PENDING':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const MyAccount = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Import mock orders dynamically
        import('../data/mockUsers').then(({ mockOrders }) => {
            console.log('MyAccount: Loaded mock orders:', mockOrders);

            if (currentUser) {
                // Filter orders for the current user if possible
                const userOrders = mockOrders.filter(order =>
                    order.customer?.id === currentUser.id ||
                    order.customer?.email === currentUser.email
                );

                if (userOrders.length > 0) {
                    console.log('MyAccount: Found orders for user:', userOrders);
                    setOrders(userOrders);
                } else {
                    console.log('MyAccount: No specific orders found, using sample orders');
                    setOrders(mockOrders.slice(0, 3));
                }
            }
        }).catch(err => {
            console.error('Error loading mock orders:', err);
            setOrders([]);
        });
    }, [currentUser]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold mb-4">My Account</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-2">User Information</h3>
                {currentUser && (
                    <>
                        <p><strong>Name:</strong> {currentUser.displayName || currentUser.username}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>Role:</strong> {currentUser.isAdmin ? 'Administrator' : 'Regular User'}</p>
                        <p><strong>Address:</strong> {currentUser.address?.street ?
                            `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state}` :
                            'No address provided'}</p>
                        <p><strong>Phone:</strong> {currentUser.phone || 'No phone provided'}</p>
                    </>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Order History</h3>
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="border-b py-4 mb-2">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="font-semibold text-lg">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{order.totalAmount.toFixed(2)}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm font-medium">Items:</p>
                                <ul className="text-sm text-gray-600">
                                    {order.items.map(item => (
                                        <li key={item.id} className="ml-4">
                                            {item.title} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyAccount;