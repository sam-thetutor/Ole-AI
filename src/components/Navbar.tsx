import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStellarWallet } from '../contexts/StellarWalletContext'
import { ChevronDown, Copy, Check, Wallet } from 'lucide-react'

const Navbar: React.FC = () => {
  const { publicKey, connect, disconnect, balance } = useStellarWallet()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
      }
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h1>OLE</h1>
          </Link>
        </div>
      </div>
      
      <div className="navbar-right">
        {publicKey && (
          <div className="navbar-nav">
            <Link 
              to="/dashboard" 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/chat" 
              className={`nav-link ${isActive('/chat') ? 'active' : ''}`}
            >
              AI Chat
            </Link>
            
            <div className="wallet-dropdown">
              <button 
                className="wallet-dropdown-toggle"
                onClick={toggleDropdown}
              >
                <Wallet className="wallet-icon" size={16} />
                <span className="wallet-balance">{balance} XLM</span>
                <span className="wallet-address">{truncateAddress(publicKey)}</span>
                <ChevronDown className="dropdown-arrow" size={14} />
              </button>
              
              {isDropdownOpen && (
                <div className="wallet-dropdown-menu">
                  <div className="dropdown-item">
                    <span className="dropdown-label">Balance:</span>
                    <span className="dropdown-value">{balance} XLM</span>
                  </div>
                  <div className="dropdown-item">
                    <span className="dropdown-label">Address:</span>
                    <div className="dropdown-address-container">
                      <span className="dropdown-value">{truncateAddress(publicKey)}</span>
                      <button 
                        className="copy-btn"
                        onClick={copyAddress}
                        title="Copy address"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-disconnect-btn"
                    onClick={disconnect}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!publicKey && (
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