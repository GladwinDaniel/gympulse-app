import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Auth pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Member pages
import MemberLayout from './pages/member/MemberLayout';
import MemberLanding from './pages/member/MemberLanding';
import WorkoutCategoriesPage from './pages/member/WorkoutCategoriesPage';
import WorkoutCategoryDetailPage from './pages/member/WorkoutCategoryDetailPage';
import WorkoutPlansPage from './pages/member/WorkoutPlansPage';
import CreateWorkoutPlanPage from './pages/member/CreateWorkoutPlanPage';
import WorkoutPlayerPage from './pages/member/WorkoutPlayerPage';
import AnatomyPlannerPage from './pages/member/AnatomyPlannerPage';
import DietPlansPage from './pages/member/DietPlansPage';
import QRScanPage from './pages/member/QRScanPage';
import MemberMessagesPage from './pages/member/MessagesPage';
import ProfilePage from './pages/member/ProfilePage';

// Staff pages
import StaffLayout from './pages/staff/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import MembersListPage from './pages/staff/MembersListPage';
import NoticesPage from './pages/staff/NoticesPage';
import StaffMessagesPage from './pages/staff/MessagesPage';
import QRDisplayPage from './pages/staff/QRDisplayPage';
import PlansPage from './pages/staff/PlansPage';
import StaffAnatomyPlannerPage from './pages/staff/StaffAnatomyPlannerPage';
import CreateStaffAccountPage from './pages/staff/CreateStaffAccountPage';

function AppRoutes() {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading GymPulse..." />;
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={
        currentUser && userProfile ? (
          <Navigate to={userProfile.role === 'member' ? '/member' : '/staff'} replace />
        ) : (
          <LoginPage />
        )
      } />
      <Route path="/signup" element={
        currentUser ? (
          <Navigate to="/member" replace />
        ) : (
          <SignupPage />
        )
      } />

      {/* Member routes */}
      <Route path="/member" element={
        <ProtectedRoute allowedRoles={['member']}>
          <MemberLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MemberLanding />} />
        <Route path="workouts" element={<WorkoutCategoriesPage />} />
        <Route path="workouts/category/:categoryId" element={<WorkoutCategoryDetailPage />} />
        <Route path="workouts/plans" element={<WorkoutPlansPage />} />
        <Route path="workouts/create" element={<CreateWorkoutPlanPage />} />
        <Route path="workouts/player" element={<WorkoutPlayerPage />} />
        <Route path="workouts/anatomy-planner" element={<AnatomyPlannerPage />} />
        <Route path="diet" element={<DietPlansPage />} />
        <Route path="scan" element={<QRScanPage />} />
        <Route path="messages" element={<MemberMessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Staff/Trainer routes */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['staff', 'trainer']}>
          <StaffLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StaffDashboard />} />
        <Route path="members" element={<MembersListPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="anatomy-planner" element={<StaffAnatomyPlannerPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="messages" element={<StaffMessagesPage />} />
        <Route path="qr" element={<QRDisplayPage />} />
        <Route path="add-staff" element={<CreateStaffAccountPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={
        currentUser && userProfile ? (
          <Navigate to={userProfile.role === 'member' ? '/member' : '/staff'} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: 'toast-custom',
            style: {
              background: '#1a1a2e',
              color: '#f0f0f5',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
