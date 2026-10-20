import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import LoginPage from './features/authentication/pages/LoginPage';
import RegisterPage from './features/authentication/pages/RegisterPage';
import ForgotPasswordPage from './features/authentication/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/authentication/pages/ResetPasswordPage';
import VerifyEmailPage from './features/authentication/pages/VerifyEmailPage';
import { AuthProvider, useAuth } from './features/authentication/context/AuthContext';


function AppRoutes() {
  const { user, loading } = useAuth();
    const isAuthenticated = Boolean(user);

    if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
      />
      <Route
        path="/verify-email"
        element={isAuthenticated ? <Navigate to="/" replace /> : <VerifyEmailPage />}
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={
          isAuthenticated ? (
            <AppLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}