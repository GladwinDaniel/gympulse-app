import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';
import PendingApprovalPage from '../pages/PendingApprovalPage';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Not logged in → go to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Profile still loading from Firestore
  if (!userProfile) {
    return <LoadingSpinner fullScreen />;
  }

  if (userProfile.role === 'member' && userProfile.isApproved === false) {
    return <PendingApprovalPage />;
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    // Redirect to appropriate dashboard based on role
    if (userProfile.role === 'member') {
      return <Navigate to="/member" replace />;
    }
    return <Navigate to="/staff" replace />;
  }

  return children;
}
