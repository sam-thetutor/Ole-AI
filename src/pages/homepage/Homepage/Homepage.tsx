import React from 'react';
import { MessageSquare, BarChart3, RefreshCw, TrendingUp, Zap, Shield, Globe, Target } from 'lucide-react';
import logoImage from '../../../assets/logo.png';
import MetricsDisplay from '../../../components/common/MetricsDisplay/MetricsDisplay';
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
            {/* <span className="gradient-text">Ole</span> */}
          </h1>
          <p className="hero-subtitle">
            One platform, all opportunities, zero friction. Unify the entire Stellar ecosystem under a single, intelligent interface.
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
              className="connect-wallet-btn"
            >
              <span className="btn-glow"></span>
              Discover More
            </button>
            <p className="cta-subtitle">
              Experience the future of DeFi interaction
            </p>
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

      <MetricsDisplay />

      <div className="features-section">
        <h2 className="section-title">Key Value Propositions</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Globe size={48} />
            </div>
            <h3>Unified Interface</h3>
            <p>One wallet connection grants access to the entire Stellar ecosystem</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={48} />
            </div>
            <h3>AI-Powered Interaction</h3>
            <p>Natural language commands for complex DeFi operations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Zap size={48} />
            </div>
            <h3>Seamless Integration</h3>
            <p>No need to leave the platform for any DeFi activity</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <TrendingUp size={48} />
            </div>
            <h3>Maximized Opportunities</h3>
            <p>Access to all ecosystem opportunities in one place</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <RefreshCw size={48} />
            </div>
            <h3>Token Operations</h3>
            <p>Send, swap, stake, and provide liquidity across all protocols</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={48} />
            </div>
            <h3>Advanced Financial Tools</h3>
            <p>DCA, trading strategies, portfolio management, and risk controls</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Shield size={48} />
            </div>
            <h3>Payment Solutions</h3>
            <p>Recurring payments, payment links, and professional invoicing</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Target size={48} />
            </div>
            <h3>Investment Intelligence</h3>
            <p>AI-powered market analysis and opportunity discovery</p>
          </div>
        </div>
      </div>

      <div className="roadmap-section">
        <h2 className="section-title">Development Roadmap</h2>
        <div className="roadmap-container">
          <div className="roadmap-phase" style={{'--phase-index': '0'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
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
              <h3>Phase 2: Core Features</h3>
              <span className="phase-status in-progress">In Progress</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>🔄 Soroswap Inegration</li>
                <li>🔄 Defindex integration</li>
                <li>🔄 Payment links systems</li>
                <li>🔄 Advanced AI features</li>
                <li>🔄 Protocol integrations</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '2'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <h3>Phase 3: Advanced Features</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>⏳ DCA and trading strategies</li>
                <li>⏳ Portfolio management</li>
                <li>⏳ Institutional features</li>
                <li>⏳ Mobile application</li>
                <li>⏳ Advanced analytics</li>
              </ul>
            </div>
          </div>

          <div className="roadmap-phase" style={{'--phase-index': '3'} as React.CSSProperties}>
            <div className="hover-effect"></div>
            <div className="phase-header">
              <h3>Phase 4: Ecosystem Expansion</h3>
              <span className="phase-status planned">Planned</span>
            </div>
            <div className="phase-content">
              <ul>
                <li>⏳ Cross-chain integration</li>
                <li>⏳ Advanced analytics</li>
                <li>⏳ Enterprise solutions</li>
                <li>⏳ Global expansion</li>
                <li>⏳ API for developers</li>
              </ul>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Homepage; 