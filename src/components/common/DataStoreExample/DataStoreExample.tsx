import React, { useState } from 'react';
import { useDataStoreHook, useMetrics, useWallet, useTransactions, usePaymentLinks, useChat } from '../../../hooks';
import { RefreshCw, AlertCircle, CheckCircle, Loader2, Wallet, MessageSquare, CreditCard, BarChart3 } from 'lucide-react';
import './DataStoreExample.css';

const DataStoreExample: React.FC = () => {
  const {
    // Main store functions
    refreshAllData,
    isAuthenticated,
    getXlmBalance,
    getRecentTransactions,
    getPendingPaymentLinks,
    getPaidPaymentLinks,
    getUserRank,
    getUserScore,
    isLoading,
    hasErrors,
    getAllErrors,
    clearAllErrors,
    getDataFreshness,
    isDataStale
  } = useDataStoreHook();

  // Specialized hooks
  const { metrics, loading: metricsLoading } = useMetrics();
  const { walletData, loading: walletLoading } = useWallet();
  const { transactions, loading: transactionsLoading } = useTransactions(5);
  const { paymentLinks, loading: paymentLinksLoading } = usePaymentLinks();
  const { chatMessages, loading: chatLoading, sendChatMessage } = useChat();

  const [chatInput, setChatInput] = useState('');
  const [showDataFreshness, setShowDataFreshness] = useState(false);

  const handleSendChat = async () => {
    if (chatInput.trim()) {
      await sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  const formatTimeAgo = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getStatusIcon = (isStale: boolean, loading: boolean) => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (isStale) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="data-store-example">
      <div className="header">
        <h1>Data Store Example</h1>
        <div className="header-actions">
          <button 
            onClick={refreshAllData}
            disabled={isLoading()}
            className="btn btn-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh All
          </button>
          <button 
            onClick={() => setShowDataFreshness(!showDataFreshness)}
            className="btn btn-secondary"
          >
            Data Status
          </button>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="section">
        <h2>Authentication Status</h2>
        <div className="status-card">
          <div className="status-item">
            <span>Authenticated:</span>
            <span className={isAuthenticated() ? 'text-green-500' : 'text-red-500'}>
              {isAuthenticated() ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Freshness Overview */}
      {showDataFreshness && (
        <div className="section">
          <h2>Data Freshness</h2>
          <div className="freshness-grid">
            <div className="freshness-item">
              <span>Metrics:</span>
              {getStatusIcon(isDataStale('metrics'), metricsLoading)}
              <span>{formatTimeAgo(getDataFreshness().metrics)}</span>
            </div>
            <div className="freshness-item">
              <span>Leaderboard:</span>
              {getStatusIcon(isDataStale('leaderboard'), false)}
              <span>{formatTimeAgo(getDataFreshness().leaderboard)}</span>
            </div>
            <div className="freshness-item">
              <span>User Profile:</span>
              {getStatusIcon(isDataStale('userProfile'), false)}
              <span>{formatTimeAgo(getDataFreshness().userProfile)}</span>
            </div>
            <div className="freshness-item">
              <span>Wallet:</span>
              {getStatusIcon(isDataStale('wallet'), walletLoading)}
              <span>{formatTimeAgo(getDataFreshness().wallet)}</span>
            </div>
            <div className="freshness-item">
              <span>Transactions:</span>
              {getStatusIcon(isDataStale('transactions'), transactionsLoading)}
              <span>{formatTimeAgo(getDataFreshness().transactions)}</span>
            </div>
            <div className="freshness-item">
              <span>Payment Links:</span>
              {getStatusIcon(isDataStale('paymentLinks'), paymentLinksLoading)}
              <span>{formatTimeAgo(getDataFreshness().paymentLinks)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {hasErrors() && (
        <div className="section">
          <h2>Errors</h2>
          <div className="error-list">
            {getAllErrors().map((error, index) => (
              <div key={index} className="error-item">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="error-type">{error.type}:</span>
                <span className="error-message">{error.error}</span>
              </div>
            ))}
            <button onClick={clearAllErrors} className="btn btn-sm btn-outline">
              Clear Errors
            </button>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="section">
        <h2>Platform Metrics</h2>
        {metricsLoading ? (
          <div className="loading">Loading metrics...</div>
        ) : metrics ? (
          <div className="metrics-grid">
            <div className="metric-card">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <div className="metric-content">
                <span className="metric-value">{metrics.totalPrompts}</span>
                <span className="metric-label">Total Prompts</span>
              </div>
            </div>
            <div className="metric-card">
              <CreditCard className="w-6 h-6 text-green-500" />
              <div className="metric-content">
                <span className="metric-value">{metrics.totalPayments}</span>
                <span className="metric-label">Total Payments</span>
              </div>
            </div>
            <div className="metric-card">
              <Wallet className="w-6 h-6 text-purple-500" />
              <div className="metric-content">
                <span className="metric-value">{metrics.totalWalletCreations}</span>
                <span className="metric-label">Wallets Created</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="error">Failed to load metrics</div>
        )}
      </div>

      {/* Wallet Information */}
      {isAuthenticated() && (
        <div className="section">
          <h2>Wallet Information</h2>
          {walletLoading ? (
            <div className="loading">Loading wallet data...</div>
          ) : walletData ? (
            <div className="wallet-info">
              <div className="wallet-card">
                <Wallet className="w-6 h-6 text-blue-500" />
                <div className="wallet-content">
                  <span className="wallet-address">{walletData.publicKey}</span>
                  <span className="wallet-balance">XLM: {getXlmBalance()}</span>
                  <span className="wallet-network">Network: {walletData.network}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error">Failed to load wallet data</div>
          )}
        </div>
      )}

      {/* Recent Transactions */}
      {isAuthenticated() && (
        <div className="section">
          <h2>Recent Transactions</h2>
          {transactionsLoading ? (
            <div className="loading">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            <div className="transactions-list">
              {getRecentTransactions(3).map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-header">
                    <span className="transaction-type">{tx.type}</span>
                    <span className="transaction-amount">{tx.amount} {tx.asset}</span>
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-time">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </span>
                    <span className="transaction-status">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No transactions found</div>
          )}
        </div>
      )}

      {/* Payment Links */}
      {isAuthenticated() && (
        <div className="section">
          <h2>Payment Links</h2>
          {paymentLinksLoading ? (
            <div className="loading">Loading payment links...</div>
          ) : paymentLinks.length > 0 ? (
            <div className="payment-links-grid">
              <div className="payment-links-section">
                <h3>Pending ({getPendingPaymentLinks().length})</h3>
                {getPendingPaymentLinks().map((link) => (
                  <div key={link.linkId} className="payment-link-item pending">
                    <span className="link-title">{link.title || 'Untitled'}</span>
                    <span className="link-amount">
                      {link.type === 'fixed' ? `${link.amount} XLM` : 'Variable'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="payment-links-section">
                <h3>Paid ({getPaidPaymentLinks().length})</h3>
                {getPaidPaymentLinks().map((link) => (
                  <div key={link.linkId} className="payment-link-item paid">
                    <span className="link-title">{link.title || 'Untitled'}</span>
                    <span className="link-amount">
                      {link.type === 'fixed' ? `${link.amount} XLM` : 'Variable'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">No payment links found</div>
          )}
        </div>
      )}

      {/* Chat Interface */}
      {isAuthenticated() && (
        <div className="section">
          <h2>Chat Interface</h2>
          <div className="chat-container">
            <div className="chat-messages">
              {chatMessages.length > 0 ? (
                chatMessages.slice(-3).map((msg) => (
                  <div key={msg.id} className="chat-message">
                    <div className="message-user">
                      <span className="message-text">{msg.message}</span>
                    </div>
                    <div className="message-bot">
                      <span className="message-text">{msg.response}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No messages yet</div>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type a message..."
                disabled={chatLoading}
              />
              <button 
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="btn btn-primary"
              >
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Stats */}
      {isAuthenticated() && (
        <div className="section">
          <h2>User Statistics</h2>
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">Weekly Rank:</span>
              <span className="stat-value">{getUserRank('weekly') || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Weekly Score:</span>
              <span className="stat-value">{getUserScore('weekly')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Rank:</span>
              <span className="stat-value">{getUserRank('monthly') || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Monthly Score:</span>
              <span className="stat-value">{getUserScore('monthly')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataStoreExample; 