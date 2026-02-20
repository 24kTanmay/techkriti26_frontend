import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAILS } from '../config/admins';

const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Strict check for admin emails
  if (!ADMIN_EMAILS.includes(currentUser.email)) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <p>Current User: {currentUser.email}</p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
