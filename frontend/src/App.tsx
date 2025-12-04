import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import QRCodePage from './pages/QRCode';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/AdminRegister';
import Dashboard from './pages/admin/Dashboard';
import Members from './pages/admin/Members';
import Settings from './pages/admin/Settings';
import Attendance from './pages/admin/Attendance';
import Communion from './pages/admin/Communion';
import Reports from './pages/admin/Reports';
import PastorateDashboard from './pages/admin/PastorateDashboard';
import MissionManagement from './pages/admin/MissionManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Registration */}
        <Route path="/admin/register" element={<AdminRegister />} />
        
        {/* Protected Admin Routes - Campus (ELDER, CLERK) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/members" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Members />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Settings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/attendance" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Attendance />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/communion" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Communion />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute allowedRoles={['ELDER', 'CLERK']}>
              <Reports />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes - Pastorate (PASTORATE only) */}
        <Route 
          path="/admin/pastorate" 
          element={
            <ProtectedRoute allowedRoles={['PASTORATE']}>
              <PastorateDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/missions" 
          element={
            <ProtectedRoute allowedRoles={['PASTORATE']}>
              <MissionManagement />
            </ProtectedRoute>
          } 
        />

        {/* Admin Root - Redirect based on role */}
        <Route path="/admin" element={<AdminRedirect />} />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper component to redirect /admin based on role
function AdminRedirect() {
  const adminData = localStorage.getItem('admin');
  
  if (!adminData) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const admin = JSON.parse(adminData);
    
    if (admin. role === 'PASTORATE') {
      return <Navigate to="/admin/pastorate" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }
}

export default App;