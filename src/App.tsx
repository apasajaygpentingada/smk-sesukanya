import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import SetupRequired from './components/SetupRequired';
import { isSupabaseConfigured } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeAttendance from './pages/EmployeeAttendance';
import StudentAttendance from './pages/StudentAttendance';
import EmployeeRecap from './pages/EmployeeRecap';
import StudentRecap from './pages/StudentRecap';
import StudentData from './pages/StudentData';
import UserManagement from './pages/UserManagement';
import SqlEditor from './pages/SqlEditor';

export default function App() {
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* App Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
        
        {/* Guru & Admin Only */}
        <Route
          path="absensi-siswa"
          element={
            <ProtectedRoute allowedRoles={['admin', 'guru']}>
              <StudentAttendance />
            </ProtectedRoute>
          }
        />
        
        {/* Recap Submenu */}
        <Route path="rekap">
          <Route index element={<Navigate to="/app/rekap/siswa" replace />} />
          <Route
            path="karyawan"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EmployeeRecap />
              </ProtectedRoute>
            }
          />
          <Route
            path="siswa"
            element={
              <ProtectedRoute allowedRoles={['admin', 'guru']}>
                <StudentRecap />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Only */}
        <Route
          path="siswa"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentData />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="sql"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SqlEditor />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
