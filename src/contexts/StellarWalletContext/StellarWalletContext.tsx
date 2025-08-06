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
  generatedWallet: {
    publicKey: string;
    network: string;
    balances: any[];
    createdAt: string;
    lastBalanceCheck: string;
  } | null;
  isConnected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  kitInstance: StellarWalletsKit;
  isAuthenticated: boolean;
  refreshGeneratedWallet: () => Promise<void>;
}

// Define the context
const StellarWalletContext = createContext<StellarWalletContextProps | undefined>(undefined);

export const StellarWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [generatedWallet, setGeneratedWallet] = useState<any>(null);
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
            // Fetch generated wallet if authenticated
            await refreshGeneratedWallet();
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

  const refreshGeneratedWallet = async () => {
    if (isAuthenticated) {
      try {
        const response = await apiService.getGeneratedWallet();
        if (response.success && response.data) {
          setGeneratedWallet(response.data);
        }
      } catch (error) {
        console.error('Failed to refresh generated wallet:', error);
      }
    }
  };

  const connect = async () => {
    setConnecting(true);
    try {
      await kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setPublicKey(address);

            // Connect to backend and get tokens
            const response = await apiService.connectWallet(address);
            if (response.success) {
              setIsAuthenticated(true);
              
              // If this is a new user, they'll have a generated wallet
              if (response.data?.generatedWallet) {
                setGeneratedWallet(response.data.generatedWallet);
              } else {
                // Existing user, fetch their generated wallet
                await refreshGeneratedWallet();
              }
              
              console.log('Wallet connected and authenticated with backend');
            } else {
              console.error('Backend authentication failed:', response);
              throw new Error('Backend authentication failed');
            }
          } catch (error) {
            console.error('Failed to get address or authenticate:', error);
            throw error;
          }
        }
      });
    } catch (e: any) {
      console.error('Failed to connect wallet:', e);
      
      if (e.message?.includes('User rejected')) {
        alert('Wallet connection was rejected by user');
      } else if (e.message?.includes('No wallet')) {
        alert('Please install a Stellar wallet extension (Freighter or Lobstr)');
      } else {
        alert('Failed to connect wallet: ' + (e.message || e));
      }
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
    setGeneratedWallet(null);
    setIsAuthenticated(false);
  };

  return (
    <StellarWalletContext.Provider value={{ 
      publicKey, 
      generatedWallet,
      isConnected: !!publicKey,
      connecting,
      connect, 
      disconnect, 
      kitInstance: kit,
      isAuthenticated,
      refreshGeneratedWallet
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