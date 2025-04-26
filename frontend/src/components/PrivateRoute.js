import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute: Checking authentication', { currentUser, loading, path: location.pathname });

  if (loading) {
    console.log('PrivateRoute: Still loading auth state');
    return <div className="flex justify-center items-center h-24">Loading...</div>;
  }

  if (!currentUser) {
    console.log('PrivateRoute: No authenticated user, redirecting to login');
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  console.log('PrivateRoute: User authenticated, rendering protected content');
  return children;
};

export default PrivateRoute;