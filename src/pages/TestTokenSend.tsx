import React from 'react';
import TokenSendFormDemo from '../components/forms/TokenSendForm/TokenSendFormDemo';

const TestTokenSend: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          color: '#00ff88', 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontFamily: 'Audiowide, monospace',
          textShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
        }}>
          Token Send Form Demo
        </h1>
        
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.6)', 
          border: '1px solid rgba(0, 255, 136, 0.2)', 
          borderRadius: '16px', 
          padding: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ color: '#00ff88', marginBottom: '1rem' }}>
            Interactive Token Sending Form
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>
            This demonstrates the multi-step form that would be triggered by the AI agent when a user wants to send tokens.
            The form includes amount selection, recipient address validation, and transaction confirmation.
          </p>
          
          <TokenSendFormDemo />
        </div>
      </div>
    </div>
  );
};

export default TestTokenSend; 