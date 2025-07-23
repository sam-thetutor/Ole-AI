import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  allowAllModules,
  FREIGHTER_ID,
  StellarWalletsKit,
  WalletNetwork
} from "@creit.tech/stellar-wallets-kit";
import {Horizon} from '@stellar/stellar-sdk';

const SELECTED_WALLET_ID = "selectedWalletId";
const WALLET_PUBLIC_KEY = "walletPublicKey";
const horizonUrl = 'https://horizon-testnet.stellar.org';

const server = new Horizon.Server(horizonUrl);



interface StellarWalletContextProps {
  publicKey: string | null;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  fetchRecentPayments: (address: string, limit: number) => Promise<any[]>;
  createPayment: (address: string, amount: number) => Promise<string>;
}

// Define the context
const StellarWalletContext = createContext<StellarWalletContextProps | undefined>(undefined);

export const StellarWalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [kitInstance, setKitInstance] = useState<StellarWalletsKit | null>(null);

  // Move kit instantiation inside useEffect to avoid SSR/localStorage errors
  useEffect(() => {
    const selectedId = typeof window !== "undefined"
      ? (localStorage.getItem(SELECTED_WALLET_ID) ?? FREIGHTER_ID)
      : FREIGHTER_ID;

    const newKit = new StellarWalletsKit({
      modules: allowAllModules(),
      network: "Test SDF Network ; September 2015" as WalletNetwork,
      selectedWalletId: selectedId,
    });
    setKitInstance(newKit);
  }, []);

  useEffect(() => {
    if (!kitInstance) return;
    
    // Check if we have a stored public key in localStorage
    const storedPublicKey = localStorage.getItem(WALLET_PUBLIC_KEY);
    const selectedWalletId = localStorage.getItem(SELECTED_WALLET_ID);
    
    if (storedPublicKey && selectedWalletId) {
      // Use the stored public key instead of trying to get it from the wallet
      setPublicKey(storedPublicKey);
      getBalance(storedPublicKey).then(setBalance);
    }
  }, [kitInstance]);

  const getPublicKey = async () => {
    if (!kitInstance) return null;
    if (typeof window === "undefined" || !localStorage.getItem(SELECTED_WALLET_ID)) return null;
    
    try {
      const { address } = await kitInstance.getAddress();
      return address;
    } catch (error) {
      console.log('Error getting address:', error);
      return null;
    }
  };

  const getBalance = async (address: string) => {
    try {
      const account = await server.loadAccount(address);
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      return Number(xlmBalance?.balance)?.toFixed(2) || '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  };

 

  const connect = async () => {
    if (!kitInstance) return;
    await kitInstance.openModal({
      onWalletSelected: async (option) => {
        try {
          localStorage.setItem(SELECTED_WALLET_ID, option.id);
          kitInstance.setWallet(option.id);
          const key = await getPublicKey();
          if (key) {
            // Store the public key in localStorage
            localStorage.setItem(WALLET_PUBLIC_KEY, key);
            setPublicKey(key);
            const balance = await getBalance(key);
            setBalance(balance);
          }
        } catch (e) {
          console.error(e);
        }
      },
    });
  };


  const createPayment = async (address: string, amount: number) => {
    if (!kitInstance) return;

    const transaction = new kitInstance.TransactionBuilder(publicKey, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })




    
  };

  

  const disconnect = async () => {
    if (!kitInstance) return;
    localStorage.removeItem(SELECTED_WALLET_ID);
    localStorage.removeItem(WALLET_PUBLIC_KEY);
    kitInstance.disconnect();
    setPublicKey(null);
    setBalance('0');
  };

  const fetchRecentPayments = async (address: string, limit: number = 10) => {
    try {
      const payments = await server.payments().forAccount(address).limit(limit).call();
      return payments.records;
    } catch (error) {
      console.error('Error fetching recent payments:', error);
      return [];
    }
  };


  return (
    <StellarWalletContext.Provider value={{ publicKey, balance, connect, disconnect, getBalance, fetchRecentPayments, createPayment }}>
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