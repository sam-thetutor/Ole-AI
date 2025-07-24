import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">OLE AI Agent</h3>
          <p className="footer-description">
            Your intelligent companion for navigating the Stellar blockchain. 
            Experience the future of decentralized finance.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Product</h4>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#roadmap">Roadmap</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#api">API</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Resources</h4>
          <ul className="footer-links">
            <li><a href="#docs">Documentation</a></li>
            <li><a href="#tutorials">Tutorials</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Company</h4>
          <ul className="footer-links">
            <li><a href="#about">About</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} OLE AI Agent. Made with <Heart size={16} className="heart-icon" /> for the Stellar community.
          </p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">•</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 