import React from 'react'
import { useStellarWallet } from '../contexts/StellarWalletContext'

const Navbar: React.FC = () => {
  const { publicKey, connect, disconnect, balance } = useStellarWallet()

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Ole</h1>
      </div>
      <div className="navbar-wallet">
        {publicKey ? (
          <div className="wallet-connected">
            <span className="wallet-balance">{balance} XLM</span>
            <span className="wallet-address">{truncateAddress(publicKey)}</span>
            <button 
              className="disconnect-btn"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            className="connect-btn"
            onClick={connect}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar 