import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext';
import { Networks, TransactionBuilder, Asset, Operation } from '@stellar/stellar-sdk';
import Server from '@stellar/stellar-sdk';
import apiService from '../../../services/api';
import './PaymentPage.css';

interface PaymentLinkData {
  linkId: string;
  type: 'fixed' | 'global';
  amount?: number;
  title?: string;
  description?: string;
  creator: string;
  createdAt: string;
  status: 'pending' | 'paid';
  totalContributions?: number;
  totalContributors?: number;
}

const PaymentPage: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const { publicKey, isConnected, connect, kitInstance } = useStellarWallet();
  
  const [paymentLink, setPaymentLink] = useState<PaymentLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributing, setContributing] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (linkId) {
      fetchPaymentLink();
    }
  }, [linkId]);

  const fetchPaymentLink = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch the actual payment link data from the backend
      const response = await apiService.getPaymentLink(linkId!);
      
      if (response.success && response.data) {
        setPaymentLink(response.data);
      } else {
        setError(response.message || 'Failed to load payment link');
      }
    } catch (err) {
      setError('Failed to load payment link. Please check the URL and try again.');
      console.error('Error fetching payment link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFixedAmount = async () => {
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!paymentLink || paymentLink.type !== 'fixed' || !paymentLink.amount) {
      setError('Invalid payment link');
      return;
    }

    try {
      setContributing(true);
      
      // Create and submit Stellar transaction directly
      const server = new Server('https://horizon-testnet.stellar.org');
      
      // Get the source account
      const sourceAccount = await server.getAccount(publicKey);
      
      // Create the transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        Operation.payment({
          destination: paymentLink.creator,
          asset: Asset.native(),
          amount: paymentLink.amount.toString(),
        })
      )
      .setTimeout(180)
      .build();

      // Sign and submit the transaction using the wallet
      const signedTransaction = await kitInstance.signTransaction(transaction.toXDR());
      const response = await server.sendTransaction(signedTransaction);
      
      if (response.status === 'PENDING' || response.status === 'SUCCESS') {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setContributing(false);
    }
  };

  const handleContributeGlobal = async () => {
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!paymentLink || paymentLink.type !== 'global') {
      setError('Invalid payment link');
      return;
    }

    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setContributing(true);
      
      // Create and submit Stellar transaction directly
      const server = new Server('https://horizon-testnet.stellar.org');
      
      // Get the source account
      const sourceAccount = await server.getAccount(publicKey);
      
      // Create the transaction
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(
        Operation.payment({
          destination: paymentLink.creator,
          asset: Asset.native(),
          amount: amount.toString(),
        })
      )
      .setTimeout(180)
      .build();

      // Sign and submit the transaction using the wallet
      const signedTransaction = await kitInstance.signTransaction(transaction.toXDR());
      const response = await server.sendTransaction(signedTransaction);
      
      if (response.status === 'PENDING' || response.status === 'SUCCESS') {
        setShowSuccess(true);
        setContributionAmount('');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError('Contribution failed. Please try again.');
      }
    } catch (err) {
      setError('Contribution failed. Please try again.');
      console.error('Contribution error:', err);
    } finally {
      setContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading payment link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">
            <h2>❌ Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="back-button">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentLink) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="error-message">
            <h2>🔍 Payment Link Not Found</h2>
            <p>The payment link you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/')} className="back-button">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <div className="success-message">
            <h2>✅ Payment Successful!</h2>
            <p>Your payment has been processed successfully.</p>
            <p>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>💳 Payment Link</h1>
          <p className="link-id">ID: {paymentLink.linkId}</p>
        </div>

        <div className="payment-details">
          <div className="detail-card">
            <h3>{paymentLink.title || 'Payment Link'}</h3>
            {paymentLink.description && (
              <p className="description">{paymentLink.description}</p>
            )}
            
            <div className="payment-info">
              <div className="info-row">
                <span className="label">Type:</span>
                <span className="value">
                  {paymentLink.type === 'fixed' ? '🔒 Fixed Amount' : '🌐 Global (Flexible)'}
                </span>
              </div>
              
              {paymentLink.type === 'fixed' && paymentLink.amount && (
                <div className="info-row">
                  <span className="label">Amount:</span>
                  <span className="value amount">💰 {paymentLink.amount} XLM</span>
                </div>
              )}
              
              {paymentLink.type === 'global' && (
                <>
                  <div className="info-row">
                    <span className="label">Total Contributions:</span>
                    <span className="value">💰 {paymentLink.totalContributions || 0} XLM</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Contributors:</span>
                    <span className="value">👥 {paymentLink.totalContributors || 0}</span>
                  </div>
                </>
              )}
              
              <div className="info-row">
                <span className="label">Status:</span>
                <span className={`value status ${paymentLink.status}`}>
                  {paymentLink.status === 'pending' ? '⏳ Pending' : '✅ Paid'}
                </span>
              </div>
              
              <div className="info-row">
                <span className="label">Created:</span>
                <span className="value">
                  {new Date(paymentLink.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-action">
          {!isConnected ? (
            <div className="connect-prompt">
              <p>🔗 Connect your wallet to make a payment</p>
              <button onClick={connect} className="connect-button">
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="payment-form">
              {paymentLink.type === 'fixed' ? (
                <div className="fixed-payment">
                  <h3>Pay Fixed Amount</h3>
                  <p>Amount: <strong>{paymentLink.amount} XLM</strong></p>
                  <button 
                    onClick={handlePayFixedAmount}
                    disabled={contributing}
                    className="pay-button"
                  >
                    {contributing ? 'Processing...' : `Pay ${paymentLink.amount} XLM`}
                  </button>
                </div>
              ) : (
                <div className="global-payment">
                  <h3>Make a Contribution</h3>
                  <div className="amount-input">
                    <label htmlFor="contribution-amount">Amount (XLM):</label>
                    <input
                      type="number"
                      id="contribution-amount"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0.0000001"
                      step="0.0000001"
                      disabled={contributing}
                    />
                  </div>
                  <button 
                    onClick={handleContributeGlobal}
                    disabled={contributing || !contributionAmount}
                    className="pay-button"
                  >
                    {contributing ? 'Processing...' : 'Contribute'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="payment-footer">
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 