import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { Login } from '@pages/Login';
import { Register } from '@pages/Register';
import { Dashboard } from '@pages/Dashboard';
import { UserList } from '@pages/User/UserList';
import { RoleList } from '@pages/System/RoleList';
import { MenuList } from '@pages/System/MenuList';
import { DepartmentList } from '@pages/System/DepartmentList';
import { DictList } from '@pages/Business/DictList';
import { OperationLog } from '@pages/Log/OperationLog';
import { LoginLog } from '@pages/Log/LoginLog';
import { AppLayout } from '@components/Layout/AppLayout';
import { useUserStore } from '@stores';

// 路由守卫组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/system/user',
    element: (
      <ProtectedRoute>
        <UserList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/system/role',
    element: (
      <ProtectedRoute>
        <RoleList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/system/menu',
    element: (
      <ProtectedRoute>
        <MenuList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/system/department',
    element: (
      <ProtectedRoute>
        <DepartmentList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/business/dict',
    element: (
      <ProtectedRoute>
        <DictList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/business/config',
    element: (
      <ProtectedRoute>
        <div>参数配置页面（待开发）</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/log/operation',
    element: (
      <ProtectedRoute>
        <OperationLog />
      </ProtectedRoute>
    ),
  },
  {
    path: '/log/login',
    element: (
      <ProtectedRoute>
        <LoginLog />
      </ProtectedRoute>
    ),
  },
  {
    path: '/report',
    element: (
      <ProtectedRoute>
        <div>报表中心页面（待开发）</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>页面未找到</p>
      </div>
    ),
  },
]);