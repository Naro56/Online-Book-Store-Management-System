import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackgroundImage from '../components/BackgroundImage';
import { mockUsers } from '../data/mockUsers';

const LandingPage = () => {
  const navigate = useNavigate();
  const { loginWithHardcoded } = useAuth();
  const [demoUsers, setDemoUsers] = useState([]);
  const [demoAdmins, setDemoAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'admins'

  useEffect(() => {
    // Filter users and admins from mockUsers
    const users = mockUsers.filter(user => user.userType === 'user');
    const admins = mockUsers.filter(user => user.userType === 'admin');

    setDemoUsers(users);
    setDemoAdmins(admins);
  }, []);

  const handleQuickSignIn = async (userType, username) => {
    try {
      console.log(`LandingPage: Attempting quick sign in as ${userType} with username ${username}`);
      const user = await loginWithHardcoded(userType, username);
      console.log(`LandingPage: Successfully signed in as ${userType}`, user);

      // Navigate to admin dashboard if admin, otherwise to home
      if (userType === 'admin') {
        console.log('LandingPage: Navigating to admin dashboard');
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error(`Error signing in as ${userType}:`, error);
      // Error is handled by the AuthContext
    }
  };

  const handleRegularSignIn = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <BackgroundImage
      imageUrl="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
    >
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Welcome to BookStore
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your one-stop destination for the best books
            </p>
          </div>

          {/* Tabs for Users and Admins */}
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('users')}
            >
              Demo Users
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === 'admins' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('admins')}
            >
              Demo Admins
            </button>
          </div>

          {/* User/Admin Cards */}
          <div className="mt-6">
            {activeTab === 'users' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {demoUsers.map(user => (
                  <div key={user.id} className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{user.displayName}</h3>
                        <p className="text-xs text-gray-500">{user.description || 'Regular User'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickSignIn('user', user.username)}
                      className="w-full mt-2 py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Sign in as {user.displayName}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {demoAdmins.map(admin => (
                  <div key={admin.id} className="border rounded-lg p-4 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                        {admin.displayName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium">{admin.displayName}</h3>
                        <p className="text-xs text-gray-500">{admin.description || 'Administrator'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickSignIn('admin', admin.username)}
                      className="w-full mt-2 py-2 px-3 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Sign in as {admin.displayName}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleRegularSignIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                Sign in with Database Credentials
              </button>
              <button
                onClick={handleRegister}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                </span>
                Register New Account
              </button>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              For quick access, select a demo user or admin above.<br />
              For database authentication, use the sign in option.
            </p>
          </div>
        </div>
      </div>
    </BackgroundImage>
  );
};

export default LandingPage;