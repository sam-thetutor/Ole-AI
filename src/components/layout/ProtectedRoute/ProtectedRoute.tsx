import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isConnected } = useStellarWallet();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 