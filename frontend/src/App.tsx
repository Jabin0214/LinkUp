import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthResponse, getCurrentUser } from './Services/UserService';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token and fetch user info on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (token && refreshToken) {
      getCurrentUser(token)
        .then(userInfo => {
          setAuth({
            token,
            refreshToken,
            expiresAt: '',
            user: userInfo
          });
        })
        .catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLoginSuccess = (authData: AuthResponse) => {
    setAuth(authData);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = (authData: AuthResponse) => {
    setAuth(authData);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth(null);
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !auth ? (
            <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !auth ? (
            <RegisterPage onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => navigate('/login')} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          auth ? (
            <DashboardPage auth={auth} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to={auth ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={auth ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
