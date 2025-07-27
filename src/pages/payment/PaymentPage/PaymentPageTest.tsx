import React from 'react';
import { Link } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPageTest: React.FC = () => {
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>🧪 Payment Page Test</h1>
          <p>Test the payment page with different link types</p>
        </div>

        <div className="payment-details">
          <div className="detail-card">
            <h3>Test Links</h3>
            <p>Click the links below to test the payment page functionality:</p>
            
            <div className="test-links">
              <div className="test-link">
                <h4>🔒 Fixed Payment Link</h4>
                <p>Test a fixed amount payment link (50 XLM)</p>
                <Link to="/pay/fixed-50-xlm" className="test-button">
                  Test Fixed Payment
                </Link>
              </div>
              
              <div className="test-link">
                <h4>🌐 Global Payment Link</h4>
                <p>Test a flexible amount payment link</p>
                <Link to="/pay/global-donation-link" className="test-button">
                  Test Global Payment
                </Link>
              </div>
              
              <div className="test-link">
                <h4>❌ Invalid Link</h4>
                <p>Test error handling with invalid link</p>
                <Link to="/pay/invalid-link-123" className="test-button error">
                  Test Error Handling
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-footer">
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPageTest; 