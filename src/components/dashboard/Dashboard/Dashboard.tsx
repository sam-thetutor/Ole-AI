import React, { useState, useEffect } from 'react';
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext';
import { Send, BarChart3, RefreshCw, TrendingUp, CreditCard, Loader2, Menu, X, Wallet, History, Trophy, Calendar, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset: string;
  from: string;
  to: string;
  timestamp: string;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  address: string;
  score: number;
  transactions: number;
  volume: string;
  change: number; // percentage change
}

type DashboardSection = 'wallet' | 'transactions' | 'leaderboard';

const Dashboard: React.FC = () => {
  const { publicKey } = useStellarWallet();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<DashboardSection>('wallet');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<'weekly' | 'monthly'>('weekly');

  // Mock leaderboard data
  const weeklyLeaderboard: LeaderboardEntry[] = [
    { id: '1', rank: 1, username: 'CryptoKing', address: 'GCUE26...F4JN', score: 9850, transactions: 127, volume: '125,430 XLM', change: 12.5 },
    { id: '2', rank: 2, username: 'StellarPro', address: 'GB7XY...K9LM', score: 8740, transactions: 98, volume: '98,750 XLM', change: 8.3 },
    { id: '3', rank: 3, username: 'BlockchainQueen', address: 'GD3KJ...P2QR', score: 7620, transactions: 85, volume: '87,320 XLM', change: -2.1 },
    { id: '4', rank: 4, username: 'XLMWhale', address: 'GA5X4...M8ST', score: 6540, transactions: 72, volume: '76,890 XLM', change: 15.7 },
    { id: '5', rank: 5, username: 'DeFiMaster', address: 'GC9KL...N4UV', score: 5890, transactions: 63, volume: '65,420 XLM', change: 5.2 },
  ];

  const monthlyLeaderboard: LeaderboardEntry[] = [
    { id: '1', rank: 1, username: 'CryptoKing', address: 'GCUE26...F4JN', score: 45230, transactions: 589, volume: '567,890 XLM', change: 18.7 },
    { id: '2', rank: 2, username: 'StellarPro', address: 'GB7XY...K9LM', score: 39870, transactions: 445, volume: '498,750 XLM', change: 12.3 },
    { id: '3', rank: 3, username: 'BlockchainQueen', address: 'GD3KJ...P2QR', score: 34560, transactions: 398, volume: '432,100 XLM', change: -1.5 },
    { id: '4', rank: 4, username: 'XLMWhale', address: 'GA5X4...M8ST', score: 29890, transactions: 325, volume: '345,670 XLM', change: 22.1 },
    { id: '5', rank: 5, username: 'DeFiMaster', address: 'GC9KL...N4UV', score: 26780, transactions: 289, volume: '298,450 XLM', change: 8.9 },
  ];

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const renderWalletSection = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Wallet Overview</h1>
        <p className="dashboard-subtitle">Your Stellar wallet information</p>
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

  const renderTransactionsSection = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Transaction History</h1>
        <p className="dashboard-subtitle">Your recent Stellar transactions</p>
      </div>

      <div className="dashboard-grid">
        {/* Recent Transactions Card */}
        <div className="dashboard-card transactions-card full-width">
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
      </div>
    </div>
  );

  const renderLeaderboardSection = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Leaderboard</h1>
        <p className="dashboard-subtitle">Top performers in the Stellar ecosystem</p>
      </div>

      <div className="dashboard-grid">
        {/* Leaderboard Card */}
        <div className="dashboard-card leaderboard-card full-width">
          <div className="leaderboard-header">
            <h3 className="card-title">Top Traders</h3>
            <div className="leaderboard-tabs">
              <button
                className={`leaderboard-tab ${leaderboardType === 'weekly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('weekly')}
              >
                <Clock size={16} />
                <span>Weekly</span>
              </button>
              <button
                className={`leaderboard-tab ${leaderboardType === 'monthly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('monthly')}
              >
                <Calendar size={16} />
                <span>Monthly</span>
              </button>
            </div>
          </div>

          <div className="leaderboard-content">
            <div className="leaderboard-table">
              <div className="leaderboard-header-row">
                <div className="leaderboard-cell rank-cell">Rank</div>
                <div className="leaderboard-cell user-cell">User</div>
                <div className="leaderboard-cell score-cell">Score</div>
                <div className="leaderboard-cell change-cell">Change</div>
              </div>

              {(leaderboardType === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard).map((entry) => (
                <div key={entry.id} className="leaderboard-row">
                  <div className="leaderboard-cell rank-cell">
                    <span className="rank-icon">{getRankIcon(entry.rank)}</span>
                  </div>
                  <div className="leaderboard-cell user-cell">
                    <div className="user-info">
                      <div className="username">{entry.username}</div>
                      <div className="address">{entry.address}</div>
                    </div>
                  </div>
                  <div className="leaderboard-cell score-cell">
                    <span className="score">{entry.score.toLocaleString()}</span>
                  </div>
                  <div className="leaderboard-cell change-cell">
                    <span className={`change ${getChangeColor(entry.change)}`}>
                      {entry.change >= 0 ? '+' : ''}{entry.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Dashboard</h2>
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeSection === 'wallet' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('wallet');
              closeSidebar();
            }}
          >
            <Wallet size={20} />
            <span>Wallet</span>
          </button>
          
          <button
            className={`sidebar-nav-item ${activeSection === 'transactions' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('transactions');
              closeSidebar();
            }}
          >
            <History size={20} />
            <span>History</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeSection === 'leaderboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('leaderboard');
              closeSidebar();
            }}
          >
            <Trophy size={20} />
            <span>Leaderboard</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="mobile-title">
            {activeSection === 'wallet' ? 'Wallet' : 
             activeSection === 'transactions' ? 'Transaction History' : 'Leaderboard'}
          </h1>
        </div>

        {/* Content */}
        {activeSection === 'wallet' ? renderWalletSection() : 
         activeSection === 'transactions' ? renderTransactionsSection() : 
         renderLeaderboardSection()}
      </main>
    </div>
  );
};

export default Dashboard; 