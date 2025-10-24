// src/features/admin/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--admin-bg-primary)'
      }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/dasheram/login" replace />;
  }

  return children;
};

export default AdminRoute;
