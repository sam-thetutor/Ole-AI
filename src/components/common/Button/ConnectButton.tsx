import React from 'react';
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext';
import './ConnectButton.css';

const ConnectWalletButton: React.FC = () => {
  const { publicKey, connect, isConnected, connecting } = useStellarWallet();

  // Don't render anything if already connected (navbar handles the connected state)
  if (isConnected && publicKey) {
    return null;
  }

  return (
    <button
      className="connect-wallet-button"
      onClick={connect}
      disabled={connecting}
    >
      {connecting ? 'Connecting...' : 'Connect'}
    </button>
  );
};

export default ConnectWalletButton; 