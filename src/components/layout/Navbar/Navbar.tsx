import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext'
import { Menu, X, ChevronDown, Copy, Check, Wallet } from 'lucide-react'
import ConnectButton from '../../common/Button/ConnectButton'

const Navbar: React.FC = () => {
  const { publicKey, connect, disconnect } = useStellarWallet()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyAddress = async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea')
          textArea.value = publicKey
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (fallbackErr) {
          console.error('Fallback copy also failed:', fallbackErr)
        }
      }
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      setIsDropdownOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <h1>OLE</h1>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Desktop Navigation */}
      <div className="navbar-right desktop-nav">
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
            
            <div className="wallet-dropdown" ref={dropdownRef}>
              <button 
                className="wallet-dropdown-toggle"
                onClick={toggleDropdown}
              >
                <Wallet className="wallet-icon" size={16} />
                <span className="wallet-address">{truncateAddress(publicKey)}</span>
                <ChevronDown className="dropdown-arrow" size={14} />
              </button>
              
              {isDropdownOpen && (
                <div className="wallet-dropdown-menu">
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
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {!publicKey && <ConnectButton />}
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`}>
        {publicKey && (
          <div className="mobile-nav-content">
            <Link 
              to="/dashboard" 
              className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/chat" 
              className={`mobile-nav-link ${isActive('/chat') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              AI Chat
            </Link>
            
            <div className="mobile-wallet-info">
              <div className="mobile-wallet-header">
                <Wallet className="wallet-icon" size={20} />
                <span className="mobile-wallet-address">{truncateAddress(publicKey)}</span>
              </div>
              <div className="mobile-wallet-actions">
                <button 
                  className="mobile-copy-btn"
                  onClick={copyAddress}
                  title="Copy address"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button 
                  className="mobile-disconnect-btn"
                  onClick={() => {
                    handleDisconnect()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!publicKey && (
          <div className="mobile-connect-section">
            <button 
              className="mobile-connect-btn"
              onClick={() => {
                connect()
                setIsMobileMenuOpen(false)
              }}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 