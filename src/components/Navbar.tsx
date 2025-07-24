import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStellarWallet } from '../contexts/StellarWalletContext'
import { Menu, X } from 'lucide-react'
import ConnectButton from '../hooks/ConnectButton'

const Navbar: React.FC = () => {
  const { publicKey, connect } = useStellarWallet()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
            

          </div>
        )}

        
        {/* {!publicKey && (
          <button 
            className="connect-btn"
            onClick={connect}
          >
            Connect Wallet
          </button>
        )} */}

        <ConnectButton /> 
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