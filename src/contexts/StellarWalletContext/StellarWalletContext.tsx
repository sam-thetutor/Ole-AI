import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  LOBSTR_ID,
} from '@creit.tech/stellar-wallets-kit';
import apiService from '../../services/api';

// Create the kit instance that will be shared globally
// This kit instance can be accessed from anywhere in the app via useStellarWallet().kitInstance
const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: LOBSTR_ID,
  modules: allowAllModules(),
});

interface StellarWalletContextProps {
  publicKey: string | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  kitInstance: StellarWalletsKit;
  isAuthenticated: boolean;
}

// Define the context
const StellarWalletContext = createContext<StellarWalletContextProps | undefined>(undefined);

export const StellarWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const verification = await apiService.verifyToken();
          if (verification.valid) {
            setIsAuthenticated(true);
            setPublicKey(verification.data.walletAddress);
          } else {
            // Token is invalid, clear it
            apiService.clearTokens();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          apiService.clearTokens();
        }
      }
    };

    checkAuth();
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      const { address } = await kit.getAddress();
      setPublicKey(address);

      // Connect to backend and get tokens
      const response = await apiService.connectWallet(address);
      if (response.success) {
        setIsAuthenticated(true);
        console.log('Wallet connected and authenticated with backend');
      } else {
        console.error('Backend authentication failed:', response);
        // Still keep the wallet connected even if backend auth fails
      }
    } catch (e) {
      console.error('Failed to connect wallet:', e);
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // Disconnect from backend
      await apiService.disconnectWallet();
    } catch (error) {
      console.error('Backend disconnect error:', error);
    }

    // Disconnect from wallet
    await kit.disconnect();
    setPublicKey(null);
    setIsAuthenticated(false);
  };

  return (
    <StellarWalletContext.Provider value={{ 
      publicKey, 
      isConnected: !!publicKey,
      connecting,
      connect, 
      disconnect, 
      kitInstance: kit,
      isAuthenticated
    }}>
      {children}
    </StellarWalletContext.Provider>
  );
};

export const useStellarWallet = () => {
  const context = useContext(StellarWalletContext);
  if (!context) {
    throw new Error('useStellarWallet must be used within a StellarWalletProvider');
  }
  return context;
}; 