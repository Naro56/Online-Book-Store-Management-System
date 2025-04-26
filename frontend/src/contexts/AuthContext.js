import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { mockUsers } from '../data/mockUsers';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AuthContext: Checking for stored user credentials');
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        // Set the default Authorization header for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Parse the stored user
        let parsedUser = JSON.parse(storedUser);
        console.log('AuthContext: Found stored user:', parsedUser);

        // Add missing fields if needed
        if (parsedUser.username === 'admin') {
          // Ensure admin user has admin privileges
          parsedUser.isAdmin = true;

          // Ensure roles array exists
          if (!parsedUser.roles) {
            parsedUser.roles = [];
          }

          // Add ROLE_ADMIN if not already present
          if (!parsedUser.roles.includes('ROLE_ADMIN')) {
            parsedUser.roles.push('ROLE_ADMIN');
          }

          // Check if forceAdmin flag is set
          const forceAdmin = localStorage.getItem('forceAdmin') === 'true';
          if (forceAdmin) {
            console.log('AuthContext: Force admin flag is set');
          }

          console.log('AuthContext: Enhanced admin user from localStorage:', parsedUser);
        } else {
          // Ensure isAdmin flag is set correctly for non-admin users
          if (!parsedUser.hasOwnProperty('isAdmin')) {
            parsedUser.isAdmin = Array.isArray(parsedUser.roles) &&
              parsedUser.roles.includes('ROLE_ADMIN');
          }
        }

        console.log('AuthContext: Setting current user from localStorage:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error('AuthContext: Error parsing stored user:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    } else {
      console.log('AuthContext: No stored user found');
    }
    setLoading(false);
  }, []);

  // Login with database credentials
  const loginWithDatabase = async (username, password) => {
    setError(null);
    try {
      console.log('AuthContext: Attempting database login with username:', username);

      // Try to login with the API
      const response = await authAPI.login(username, password);
      console.log('AuthContext: Login API response:', response);

      if (!response.data || !response.data.accessToken) {
        console.error('AuthContext: Invalid response format, missing accessToken');
        throw new Error('Invalid server response. Please try again.');
      }

      const { accessToken, id, username: user_name, email, roles, fullName, address, phoneNumber } = response.data;

      // Create user object
      const user = {
        id,
        username: user_name,
        email,
        roles,
        displayName: fullName,
        address,
        phoneNumber,
        // Set admin flag based on roles
        isAdmin: Array.isArray(roles) && roles.includes('ROLE_ADMIN')
      };

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('AuthContext: Login error:', err);
      throw err;
    }
  };

  // Login with hardcoded credentials (for quick access)
  const loginWithHardcoded = (userType, username) => {
    setError(null);

    try {
      console.log(`AuthContext: Using hardcoded login - type: ${userType}, username: ${username || 'default'}`);

      let user;

      // If a specific username is provided, find that user
      if (username) {
        user = JSON.parse(JSON.stringify(mockUsers.find(u => u.username === username)));
        if (!user) {
          throw new Error(`User with username ${username} not found in mock data`);
        }
        console.log(`AuthContext: Found user ${username} in mockUsers:`, user);
      } else {
        // Otherwise use the default user for the type
        if (userType === 'admin') {
          user = JSON.parse(JSON.stringify(mockUsers.find(u => u.username === 'admin')));
        } else if (userType === 'user') {
          user = JSON.parse(JSON.stringify(mockUsers.find(u => u.username === 'rajesh_kumar')));
        } else {
          throw new Error('Invalid user type');
        }
        console.log(`AuthContext: Found default ${userType} in mockUsers:`, user);
      }

      // Ensure user has proper roles and flags based on type
      if (userType === 'admin' || (user && user.userType === 'admin')) {
        // Explicitly set isAdmin to true
        user.isAdmin = true;

        // Ensure roles array exists
        if (!user.roles) {
          user.roles = [];
        }

        // Add ROLE_ADMIN if not already present
        if (!user.roles.includes('ROLE_ADMIN')) {
          user.roles.push('ROLE_ADMIN');
        }

        // Add ROLE_USER if not already present
        if (!user.roles.includes('ROLE_USER')) {
          user.roles.push('ROLE_USER');
        }

        console.log('AuthContext: Admin user prepared with privileges:', user);
      } else {
        // Ensure regular user has proper roles but no admin privileges
        user.isAdmin = false;

        // Ensure roles array exists
        if (!user.roles) {
          user.roles = [];
        }

        // Remove ROLE_ADMIN if present
        user.roles = user.roles.filter(role => role !== 'ROLE_ADMIN');

        // Add ROLE_USER if not already present
        if (!user.roles.includes('ROLE_USER')) {
          user.roles.push('ROLE_USER');
        }

        console.log('AuthContext: Regular user prepared with privileges:', user);
      }

      if (!user) {
        throw new Error(`No ${userType} user found in mock data`);
      }

      // Generate a fake token for consistency
      const fakeToken = 'mock_' + Math.random().toString(36).substring(2, 15);

      // Save to localStorage for persistence
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Set forceAdmin flag in localStorage if this is an admin login
      if (userType === 'admin' || user.userType === 'admin' ||
          user.username === 'admin' || user.username === 'super_admin' ||
          user.username === 'inventory_admin' ||
          (Array.isArray(user.roles) && user.roles.includes('ROLE_ADMIN'))) {
        // Ensure user has admin flag and roles
        user.isAdmin = true;
        if (!user.roles) {
          user.roles = [];
        }
        if (!user.roles.includes('ROLE_ADMIN')) {
          user.roles.push('ROLE_ADMIN');
        }
        localStorage.setItem('forceAdmin', 'true');
        console.log('AuthContext: Setting forceAdmin flag and admin privileges for user:', user.username);
      } else {
        localStorage.removeItem('forceAdmin');
      }

      // Set the current user in state
      setCurrentUser(user);
      console.log('AuthContext: Successfully set currentUser:', user);

      return user;
    } catch (err) {
      console.error('AuthContext: Hardcoded login error:', err);
      setError(err.message || 'Failed to login with hardcoded credentials');
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      // Try to register with the API
      console.log('AuthContext: Sending registration request to API');
      const response = await authAPI.register(userData);
      console.log('AuthContext: Registration successful', response.data);
      return response.data;
    } catch (err) {
      console.error('AuthContext: Registration error:', err);
      throw err;
    }
  };

  // Check if the current user is an admin
  const isAdmin = () => {
    if (!currentUser) {
      console.log('isAdmin: No current user, returning false');
      return false;
    }

    // Check if user has explicit isAdmin flag
    const hasAdminFlag = currentUser.isAdmin === true;

    // Check if user has ROLE_ADMIN in roles array
    const hasAdminRole = Array.isArray(currentUser.roles) && currentUser.roles.includes('ROLE_ADMIN');

    // Check if user has admin username as fallback
    const hasAdminUsername = currentUser.username === 'admin' ||
                           currentUser.username === 'super_admin' ||
                           currentUser.username === 'inventory_admin';

    // Force admin access for quick admin login
    const forceAdmin = localStorage.getItem('forceAdmin') === 'true';

    const result = hasAdminFlag || hasAdminRole || hasAdminUsername || forceAdmin;

    console.log('isAdmin check:', {
      user: currentUser.username,
      hasAdminFlag,
      hasAdminRole,
      hasAdminUsername,
      forceAdmin,
      isAdmin: result
    });

    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('forceAdmin');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const updateUserProfile = async (userData) => {
    setError(null);
    try {
      // Try to update profile with the API
      const response = await userAPI.updateProfile(userData);

      // Update local storage with updated user data
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again later.');
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login: loginWithDatabase,
    loginWithHardcoded,
    register,
    logout,
    updateUserProfile,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};