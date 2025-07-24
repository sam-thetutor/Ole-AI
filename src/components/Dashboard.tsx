import React, { useState, useEffect } from 'react';
import { useStellarWallet } from '../contexts/StellarWalletContext';
import { Send, BarChart3, RefreshCw, TrendingUp, CreditCard, Loader2 } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { publicKey } = useStellarWallet();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (publicKey) {
      loadDashboardData();
    }
  }, [publicKey]);

  const loadDashboardData = async () => {
    if (!publicKey) return;
    
    try {
      setLoading(true);
      // For now, we'll use empty transactions since we removed the fetchRecentPayments
      // You can implement this functionality later if needed
      setRecentTransactions([]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    if (!address || address === 'Unknown') return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Your Stellar wallet overview</p>
      </div>

      <div className="dashboard-grid">
        {/* Wallet Info Card */}
        <div className="dashboard-card wallet-info-card">
          <h3 className="card-title">Wallet Information</h3>
          <div className="wallet-details">
            <div className="detail-item">
              <span className="detail-label">Public Key:</span>
              <span className="detail-value">{formatAddress(publicKey || '')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Balance:</span>
              <span className="detail-value balance-value">N/A</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value status-connected">Connected</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card quick-actions-card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-btn">
              <Send className="action-icon" size={20} />
              <span>Send Payment</span>
            </button>
            <button className="action-btn">
              <BarChart3 className="action-icon" size={20} />
              <span>View Analytics</span>
            </button>
            <button className="action-btn">
              <RefreshCw className="action-icon" size={20} />
              <span>Swap Tokens</span>
            </button>
            <button className="action-btn">
              <TrendingUp className="action-icon" size={20} />
              <span>DCA Setup</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="dashboard-card transactions-card">
          <h3 className="card-title">Recent Transactions</h3>
          {loading ? (
            <div className="loading-spinner">
              <Loader2 className="spinner" size={32} />
              <p>Loading transactions...</p>
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="transactions-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-icon">
                    {tx.type === 'payment' ? <Send size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-type">{tx.type}</div>
                    <div className="transaction-amount">
                      {tx.amount} {tx.asset}
                    </div>
                  </div>
                  <div className="transaction-meta">
                    <div className="transaction-date">{tx.timestamp}</div>
                    <div className="transaction-address">
                      {formatAddress(tx.to)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No recent transactions found</p>
            </div>
          )}
        </div>

        {/* Analytics Card */}
        <div className="dashboard-card analytics-card">
          <h3 className="card-title">Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-item">
              <div className="analytics-value">0</div>
              <div className="analytics-label">Total Transactions</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value">0 XLM</div>
              <div className="analytics-label">Total Sent</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value">0 XLM</div>
              <div className="analytics-label">Total Received</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-value">0</div>
              <div className="analytics-label">Active DCA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 