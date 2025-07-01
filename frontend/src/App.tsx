import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchUserInfo, logout, initializeAuth } from './store/slices/authSlice';
import { resetSkillBoard } from './store/slices/skillBoardSlice';
import { clearProjectState } from './store/slices/projectSlice';
import { useTheme } from './hooks/useTheme';
import { isUserAuthenticated } from './utils/authUtils';
import 'antd/dist/reset.css';
import './styles/themes.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, token } = useAppSelector(state => state.auth);

  // 初始化主题系统
  useTheme();

  // 应用初始化：初始化认证状态并获取用户信息
  useEffect(() => {
    // 初始化认证状态（基于redux-persist恢复的数据）
    dispatch(initializeAuth());

    // 验证当前认证状态
    setTimeout(() => {
      if (!isUserAuthenticated()) {
        console.log('🔧 Invalid authentication state detected, cleaning up...');
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }, 100); // 短暂延迟确保Redux state已初始化

    // 如果有token但没有用户信息，获取用户信息
    if (token && !user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, token, user]);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    // 清理localStorage中的token（保持兼容性）
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
