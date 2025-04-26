import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to home if not authenticated or not an admin
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and admin
  return children;
};

export default AdminRoute; 