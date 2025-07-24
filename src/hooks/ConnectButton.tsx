import React from 'react';
import { useStellarWallet } from '../contexts/StellarWalletContext';

const ConnectWalletButton: React.FC = () => {
  const { publicKey, connect, disconnect, isConnected, connecting } = useStellarWallet();

  if (isConnected && publicKey) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className="text-gray-700 font-mono">
          Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
        </span>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
          onClick={disconnect}
        >
          Disconnect Wallet
        </button>
      </div>
    );
  }

  return (
    <button
      className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
      onClick={connect}
      disabled={connecting}
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
};

export default ConnectWalletButton; 