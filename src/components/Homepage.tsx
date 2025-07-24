import React from 'react';
import { useStellarWallet } from '../contexts/StellarWalletContext';
import { MessageSquare, BarChart3, RefreshCw, TrendingUp } from 'lucide-react';

const Homepage: React.FC = () => {
  const { connect, isConnected } = useStellarWallet();

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">OLE</span>
            <br />
            AI Agent
          </h1>
          <p className="hero-subtitle">
            Your intelligent companion for navigating the Stellar blockchain. 
            Send tokens, create payment links, check balances, and manage your 
            investments with natural language commands.
          </p>
          
          {!isConnected ? (
            <div className="cta-section">
              <button 
                className="connect-wallet-btn primary-btn"
                onClick={connect}
              >
                <span className="btn-glow"></span>
                Connect Wallet to Start
              </button>
              <p className="cta-subtitle">
                Experience the future of blockchain interaction
              </p>
            </div>
          ) : (
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome back!</h2>
              <p className="welcome-text">
                Your wallet is connected. Ready to explore the Stellar universe?
              </p>
            </div>
          )}
        </div>
        
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
            <div className="grid-lines"></div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">What You Can Do</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={48} />
            </div>
            <h3>AI Chat Interface</h3>
            <p>Interact with your wallet using natural language commands</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={48} />
            </div>
            <h3>Dashboard Analytics</h3>
            <p>Track your transactions, balances, and investment performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <RefreshCw size={48} />
            </div>
            <h3>Token Swaps</h3>
            <p>Seamlessly swap between different Stellar tokens</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={48} />
            </div>
            <h3>DCA Management</h3>
            <p>Set up and manage Dollar Cost Averaging positions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 