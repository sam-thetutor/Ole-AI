import React, { createContext, useContext, useState, type ReactNode } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  LOBSTR_ID,
} from '@creit.tech/stellar-wallets-kit';

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
}

// Define the context
const StellarWalletContext = createContext<StellarWalletContextProps | undefined>(undefined);

export const StellarWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      const { address } = await kit.getAddress();
      setPublicKey(address);
    } catch (e) {
      alert('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    await kit.disconnect();
    setPublicKey(null);
  };

  return (
    <StellarWalletContext.Provider value={{ 
      publicKey, 
      isConnected: !!publicKey,
      connecting,
      connect, 
      disconnect, 
      kitInstance: kit
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