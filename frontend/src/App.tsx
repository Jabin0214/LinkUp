import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserInfo, logout, validatePersistedData, setAuthFromStorage } from './store/slices/authSlice';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, token } = useAppSelector(state => state.auth);

  // 智能初始化：优先使用缓存数据，减少API请求
  useEffect(() => {
    // 验证持久化数据的有效性
    dispatch(validatePersistedData());

    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedRefreshToken) {
      // 如果Redux中没有token，从localStorage恢复
      if (!token) {
        dispatch(setAuthFromStorage({
          token: storedToken,
          refreshToken: storedRefreshToken
        }));
      }

      // 只在没有用户数据或数据过期时才请求API
      if (!user) {
        console.log('🔄 No cached user data, fetching from API...');
        dispatch(fetchUserInfo());
      } else {
        console.log('✅ Using cached user data, no API call needed');
      }
    } else {
      // 清理无效的认证状态
      dispatch(logout());
    }
  }, [dispatch, token, user, navigate]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(logout());
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
          !isAuthenticated ? (
            <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => navigate('/register')} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <RegisterPage onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => navigate('/login')} />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated && user ? (
            <DashboardPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
