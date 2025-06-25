import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthResponse, getCurrentUser } from './Services/UserService';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

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
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!auth || !auth.token) {
    if (showLogin) {
      return <LoginPage onLoginSuccess={setAuth} onSwitchToRegister={() => setShowLogin(false)} />;
    } else {
      return <RegisterPage onRegisterSuccess={setAuth} onSwitchToLogin={() => setShowLogin(true)} />;
    }
  }

  return <DashboardPage auth={auth} onLogout={handleLogout} />;
};

export default App;
