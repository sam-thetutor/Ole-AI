import React, { useState } from 'react';
import TokenSendForm from './TokenSendForm';
import Modal from '../../common/Modal/Modal';

const TokenSendFormDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleComplete = (result: any) => {
    setResult(result);
    console.log('Form completed:', result);
    // Don't close modal immediately to show the result
    setTimeout(() => {
      setIsOpen(false);
      setResult(null);
    }, 3000);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
          border: 'none',
          color: '#000',
          padding: '1rem 2rem',
          borderRadius: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1.1rem'
        }}
      >
        Test Token Send Form
      </button>

      {result && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: result.success ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 71, 87, 0.1)',
          border: `1px solid ${result.success ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 71, 87, 0.3)'}`,
          borderRadius: '8px',
          color: result.success ? '#00ff88' : '#ff4757'
        }}>
          <strong>{result.success ? '✅ Success!' : '❌ Error!'}</strong>
          <p>{result.message}</p>
          {result.transactionHash && (
            <p>Transaction Hash: {result.transactionHash}</p>
          )}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={handleCancel} size="large">
        <TokenSendForm
          prefill={{
            amount: '100',
            asset: 'XLM',
            recipient: 'GABC123456789012345678901234567890123456789012345678901234567890'
          }}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
};

export default TokenSendFormDemo; 