import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Check if user is admin
  const userIsAdmin = isAdmin();

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if the link should be active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`${userIsAdmin ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className={`h-10 w-10 rounded-full ${userIsAdmin ? 'bg-red-600' : 'bg-blue-600'} flex items-center justify-center text-white text-xl font-bold mr-2`}>
                {userIsAdmin ? 'A' : 'B'}
              </div>
              <span className={`text-xl font-bold ${userIsAdmin ? 'text-white' : 'text-blue-600'}`}>
                {userIsAdmin ? 'Admin Panel' : 'BookStore'}
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {userIsAdmin ? (
                // Admin Navigation Links
                <>
                  <Link
                    to="/admin"
                    className={`${
                      isActive('/admin') && !isActive('/admin/books') && !isActive('/admin/orders')
                        ? 'border-red-500 text-white'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/books"
                    className={`${
                      isActive('/admin/books')
                        ? 'border-red-500 text-white'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    Manage Books
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`${
                      isActive('/admin/orders')
                        ? 'border-red-500 text-white'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    Manage Orders
                  </Link>
                  <Link
                    to="/admin/my-account"
                    className={`${
                      isActive('/admin/my-account')
                        ? 'border-red-500 text-white'
                        : 'border-transparent text-gray-300 hover:border-gray-400 hover:text-white'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    My Account
                  </Link>
                </>
              ) : (
                // Regular User Navigation Links
                currentUser && (
                  <>
                    <Link
                      to="/home"
                      className={`${
                        isActive('/home')
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/books"
                      className={`${
                        isActive('/books')
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      Books
                    </Link>
                    <Link
                      to="/my-account"
                      className={`${
                        isActive('/my-account')
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                    >
                      My Account
                    </Link>
                  </>
                )
              )}
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-4">
              {/* Cart - Only show for regular users */}
              {!userIsAdmin && (
                <Link to="/cart" className="relative p-1 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* User menu */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full border-2 border-gray-200"
                      src={currentUser.profileImage || `https://ui-avatars.com/api/?name=${currentUser.username}&background=random`}
                      alt={currentUser.username}
                    />
                    <span className={`hidden md:block ml-2 ${userIsAdmin ? 'text-white' : 'text-gray-700'}`}>
                      {currentUser.displayName || currentUser.username}
                    </span>
                    <svg className={`hidden md:block ml-1 h-5 w-5 ${userIsAdmin ? 'text-gray-400' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${userIsAdmin ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 py-1`}>
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className={`text-sm font-medium ${userIsAdmin ? 'text-white' : 'text-gray-900'}`}>
                          {currentUser.displayName || currentUser.username}
                          {userIsAdmin && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className={`text-xs ${userIsAdmin ? 'text-gray-400' : 'text-gray-500'} truncate`}>{currentUser.email}</p>
                      </div>
                      {userIsAdmin ? (
                        // Admin dropdown menu items
                        <>
                          <Link
                            to="/admin/my-account"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/books"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Manage Books
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Manage Orders
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                          >
                            Sign out
                          </button>
                        </>
                      ) : (
                        // Regular user dropdown menu items
                        <>
                          <Link
                            to="/my-account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            to="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Your Orders
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden md:inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  userIsAdmin
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                } focus:outline-none`}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={`sm:hidden ${userIsAdmin ? 'bg-gray-800' : 'bg-white'} border-t ${userIsAdmin ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {userIsAdmin ? (
              // Admin Mobile Navigation
              <>
                <Link
                  to="/admin"
                  className={`${
                    isActive('/admin') && !isActive('/admin/books') && !isActive('/admin/orders')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/admin') && !isActive('/admin/books') && !isActive('/admin/orders')
                      ? 'border-red-500'
                      : 'border-transparent'
                  } text-base font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/books"
                  className={`${
                    isActive('/admin/books')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/admin/books') ? 'border-red-500' : 'border-transparent'
                  } text-base font-medium`}
                >
                  Manage Books
                </Link>
                <Link
                  to="/admin/orders"
                  className={`${
                    isActive('/admin/orders')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/admin/orders') ? 'border-red-500' : 'border-transparent'
                  } text-base font-medium`}
                >
                  Manage Orders
                </Link>
                <Link
                  to="/admin/my-account"
                  className={`${
                    isActive('/admin/my-account')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/admin/my-account') ? 'border-red-500' : 'border-transparent'
                  } text-base font-medium`}
                >
                  My Account
                </Link>
              </>
            ) : (
              // Regular User Mobile Navigation
              currentUser && (
                <>
                  <Link
                    to="/home"
                    className={`${
                      isActive('/home')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/books"
                    className={`${
                      isActive('/books')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    Books
                  </Link>
                  <Link
                    to="/my-account"
                    className={`${
                      isActive('/my-account')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className={`${
                      isActive('/orders')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    Orders
                  </Link>
                  {!userIsAdmin && (
                    <Link
                      to="/cart"
                      className={`${
                        isActive('/cart')
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                    >
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                  )}
                </>
              )
            )}

            {/* Show login/register links if user is not logged in */}
            {!currentUser && (
              <>
                <Link
                  to="/login"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/login')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } text-base font-medium`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={`block pl-3 pr-4 py-2 border-l-4 ${
                    isActive('/register')
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  } text-base font-medium`}
                >
                  Register
                </Link>
              </>
            )}

            {/* Show logout button if user is logged in */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent ${
                  userIsAdmin
                    ? 'text-red-400 hover:bg-gray-700 hover:text-red-300'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                } text-base font-medium`}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
