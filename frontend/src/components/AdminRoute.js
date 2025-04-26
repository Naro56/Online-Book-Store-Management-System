import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Check admin status whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Force admin status for known admin usernames
      if (currentUser.username === 'admin' ||
          currentUser.username === 'super_admin' ||
          currentUser.username === 'inventory_admin') {
        console.log('AdminRoute: Setting admin status for known admin user:', currentUser.username);
        setUserIsAdmin(true);
        localStorage.setItem('forceAdmin', 'true');
      } else {
        const adminStatus = isAdmin();
        setUserIsAdmin(adminStatus);
        console.log('AdminRoute: Updated admin status:', adminStatus);
      }
    }
  }, [currentUser, isAdmin]);

  // Log detailed info about auth state
  useEffect(() => {
    console.log('AdminRoute: Component mounted', {
      path: location.pathname,
      isLoading: loading,
      hasUser: !!currentUser,
      userDetails: currentUser ? {
        username: currentUser.username,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin,
        roles: currentUser.roles
      } : null,
      isAdminResult: userIsAdmin
    });

    // Check localStorage directly
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('AdminRoute: localStorage user check', {
          username: parsedUser.username,
          isAdmin: parsedUser.isAdmin,
          roles: parsedUser.roles
        });
      } else {
        console.log('AdminRoute: No user found in localStorage');
      }
    } catch (e) {
      console.error('AdminRoute: Error checking localStorage', e);
    }
  }, [currentUser, loading, location.pathname, userIsAdmin]);

  console.log('AdminRoute: Checking admin authentication', {
    currentUser: currentUser?.username,
    loading,
    isAdmin: userIsAdmin,
    path: location.pathname
  });

  if (loading) {
    console.log('AdminRoute: Still loading auth state');
    return <div className="flex justify-center items-center h-24">Loading...</div>;
  }

  if (!currentUser) {
    console.log('AdminRoute: No authenticated user, redirecting to login');
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Check if forceAdmin flag is set in localStorage as a fallback
  const forceAdmin = localStorage.getItem('forceAdmin') === 'true';

  // Check if user is one of the admin users from mockUsers
  const isAdminUser = currentUser?.username === 'admin' ||
                      currentUser?.username === 'super_admin' ||
                      currentUser?.username === 'inventory_admin';

  if (!userIsAdmin && !forceAdmin && !isAdminUser) {
    console.log('AdminRoute: User is not an admin, redirecting to home', {
      username: currentUser.username,
      isAdmin: currentUser.isAdmin,
      roles: currentUser.roles,
      forceAdmin,
      isAdminUser
    });
    // Redirect to home page if not an admin
    return <Navigate to="/home" />;
  }

  if (forceAdmin) {
    console.log('AdminRoute: Force admin flag is set, allowing access');
  }

  if (isAdminUser) {
    console.log('AdminRoute: User is a known admin user, allowing access');
  }

  console.log('AdminRoute: User is admin, rendering protected content');
  return children;
};

export default AdminRoute;