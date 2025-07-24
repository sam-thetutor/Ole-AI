import React from 'react';
import { MessageSquare, BarChart3, RefreshCw, TrendingUp, Rocket, Zap, Shield, Globe, Users, Target } from 'lucide-react';
import logoImage from '../../../assets/logo.png';
import './Homepage.css';

const Homepage: React.FC = () => {
  // const { connect, isConnected } = useStellarWallet();

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
          
          {/* {!isConnected ? (
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
          )} */}
          <div className="cta-section">
            <button 
              className="connect-wallet-btn primary-btn"
            >
              <span className="btn-glow"></span>
              Discover More
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <img src={logoImage} alt="Ole" className="floating-orb orb-3" />
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

      <div className="roadmap-section">
        <h2 className="section-title">Development Roadmap</h2>
        <div className="roadmap-container">
          <div className="roadmap-phase" style={{'--phase-index': '0'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Rocket size={32} />
              </div>
              <h3>Phase 1: Foundation</h3>
              <span className="phase-status completed">Completed</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>✅ Wallet Integration (Freighter & Lobstr)</li>
                <li>✅ JWT Authentication System</li>
                <li>✅ Rate Limiting & Security</li>
                <li>✅ Basic Dashboard & Analytics</li>
                <li>✅ AI Chat Interface</li>
                <li>✅ Responsive Design</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '1'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Zap size={32} />
              </div>
              <h3>Phase 2: Enhanced Features</h3>
              <span className="phase-status in-progress">In Progress</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>🔄 Advanced AI Commands</li>
                <li>🔄 Token Swapping Integration</li>
                <li>🔄 DCA (Dollar Cost Averaging)</li>
                <li>🔄 Payment Link Generation</li>
                <li>🔄 Transaction History & Analytics</li>
                <li>🔄 Multi-wallet Support</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '2'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Shield size={32} />
              </div>
              <h3>Phase 3: Security & Compliance</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>🔒 Wallet Signature Verification</li>
                <li>🔒 Multi-factor Authentication</li>
                <li>🔒 Advanced Security Features</li>
                <li>🔒 Compliance & Audit Tools</li>
                <li>🔒 Insurance Integration</li>
                <li>🔒 Privacy Enhancements</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '3'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Globe size={32} />
              </div>
              <h3>Phase 4: Ecosystem Expansion</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>🌐 Cross-chain Integration</li>
                <li>🌐 DeFi Protocol Support</li>
                <li>🌐 NFT Management</li>
                <li>🌐 Social Trading Features</li>
                <li>🌐 API for Developers</li>
                <li>🌐 Mobile App Development</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '4'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Users size={32} />
              </div>
              <h3>Phase 5: Community & Governance</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>👥 Community Features</li>
                <li>👥 Governance Token</li>
                <li>👥 DAO Integration</li>
                <li>👥 Social Features</li>
                <li>👥 Educational Content</li>
                <li>👥 Partnership Program</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '5'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <div className="phase-icon">
                <Target size={32} />
              </div>
              <h3>Phase 6: Advanced AI & Automation</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>🤖 Advanced AI Trading</li>
                <li>🤖 Automated Portfolio Management</li>
                <li>🤖 Predictive Analytics</li>
                <li>🤖 Smart Contract Integration</li>
                <li>🤖 AI-powered Risk Management</li>
                <li>🤖 Personalized AI Assistant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 