import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserInfo, logout, validatePersistedData, setAuthFromStorage } from './store/slices/authSlice';
import { resetSkillBoard } from './store/slices/skillBoardSlice';
import { clearProjectState } from './store/slices/projectSlice';
import 'antd/dist/reset.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, token } = useAppSelector(state => state.auth);

  // 应用初始化：处理认证状态和用户数据
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedToken && storedRefreshToken) {
      // 验证并恢复认证状态
      dispatch(validatePersistedData());

      if (!token) {
        dispatch(setAuthFromStorage({
          token: storedToken,
          refreshToken: storedRefreshToken
        }));
      }

      // 获取用户信息（如果需要）
      if (!user) {
        dispatch(fetchUserInfo());
      }
    } else {
      // 清理无效状态
      dispatch(logout());
    }
  }, [dispatch, token, user]);

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
    dispatch(resetSkillBoard()); // 清理技能板状态
    dispatch(clearProjectState()); // 清理项目状态
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
