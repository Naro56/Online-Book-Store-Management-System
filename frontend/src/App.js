import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookList from './pages/admin/BookList';
import AdminBookForm from './pages/admin/BookForm';
import AdminOrderList from './pages/admin/OrderList';
import AdminOrderDetail from './pages/admin/OrderDetail';
import MyAccount from './pages/MyAccount';
import LandingPage from './pages/LandingPage';
import './App.css';

// Layout component that conditionally renders Navbar and Footer
const AppLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isLandingPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books/:id" element={
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute>
              <OrderList />
            </PrivateRoute>
          } />
          <Route path="/orders/:id" element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/profile/edit" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/books" element={
            <AdminRoute>
              <AdminBookList />
            </AdminRoute>
          } />
          <Route path="/admin/books/create" element={
            <AdminRoute>
              <AdminBookForm />
            </AdminRoute>
          } />
          <Route path="/admin/books/edit/:id" element={
            <AdminRoute>
              <AdminBookForm />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrderList />
            </AdminRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminRoute>
              <AdminOrderDetail />
            </AdminRoute>
          } />

          {/* Admin My Account Route */}
          <Route path="/admin/my-account" element={
            <AdminRoute>
              <MyAccount />
            </AdminRoute>
          } />
          <Route path="/my-account" element={
            <PrivateRoute>
              <MyAccount />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;