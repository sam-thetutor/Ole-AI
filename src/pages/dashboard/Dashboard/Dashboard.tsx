import React, { useState, useEffect } from 'react';
import { useStellarWallet } from '../../../contexts/StellarWalletContext/StellarWalletContext';
import { Send, BarChart3, RefreshCw, TrendingUp, CreditCard, Loader2, Menu, X, Wallet, History, Link, AlertCircle } from 'lucide-react';
import { useDataStoreHook, useWallet, useUserProfile } from '../../../hooks';
import PaymentLinks from '../PaymentLinks/PaymentLinks';
import './Dashboard.css';

interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset?: string;
  from?: string;
  to?: string;
  timestamp: string;
  hash?: string;
  memo?: string;
  fee?: string;
  successful?: boolean;
  ledger?: number;
  operation_count?: number;
}

type DashboardSection = 'wallet' | 'transactions' | 'payment-links';

const Dashboard: React.FC = () => {
  const { publicKey, generatedWallet } = useStellarWallet();
  const [activeSection, setActiveSection] = useState<DashboardSection>('wallet');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Use data store hooks
  const { 
    refreshUserData, 
    getXlmBalance, 
    isAuthenticated,
    isLoading: isDataLoading,
    hasErrors,
    getAllErrors
  } = useDataStoreHook();
  
  const { walletData, loading: walletLoading, error: walletError, fetchWalletData } = useWallet();
  const { userProfile, loading: userProfileLoading } = useUserProfile();

  useEffect(() => {
    try {
      console.log('Dashboard: Checking authentication...');
      console.log('Dashboard: publicKey:', publicKey);
      console.log('Dashboard: isAuthenticated function:', typeof isAuthenticated);
      
      if (publicKey && isAuthenticated()) {
        console.log('Dashboard: User is authenticated, refreshing data...');
        // Load all user data when authenticated
        refreshUserData();
      } else {
        console.log('Dashboard: User is not authenticated or no public key');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  }, [publicKey, isAuthenticated]);

  // Debug generated wallet data
  useEffect(() => {
    if (generatedWallet) {
      console.log('Generated wallet data:', generatedWallet);
      console.log('Generated wallet balances:', generatedWallet.balances);
    }
  }, [generatedWallet]);

  const handleRefreshData = () => {
    refreshUserData();
  };

  const fetchTransactionHistory = async () => {
    if (!generatedWallet?.publicKey) {
      console.log('No generated wallet available for transaction history');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching transaction history for:', generatedWallet.publicKey);

      // Fetch directly from Stellar Horizon API
      const network = 'testnet'; // You can make this configurable
      const horizonUrl = network === 'testnet' 
        ? 'https://horizon-testnet.stellar.org' 
        : 'https://horizon.stellar.org';
      
      const response = await fetch(
        `${horizonUrl}/accounts/${generatedWallet.publicKey}/transactions?limit=20&order=desc`
      );

      console.log("transaction history", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw transaction data:', data);

      if (data._embedded && data._embedded.records) {
        // Process transactions to get operation details
        const processedTransactions = await Promise.all(
          data._embedded.records.map(async (tx: any) => {
            try {
              // Fetch operations for this transaction
              const operationsResponse = await fetch(
                `${horizonUrl}/transactions/${tx.hash}/operations`
              );
              
              if (operationsResponse.ok) {
                const operationsData = await operationsResponse.json();
                const firstOp = operationsData._embedded?.records?.[0];
                
                let type = 'payment';
                let amount = '0.000000';
                let asset = 'XLM';
                let to = 'Unknown';
                
                if (firstOp) {
                  type = firstOp.type;
                  if (firstOp.type === 'payment') {
                    amount = firstOp.amount || '0.000000';
                    asset = firstOp.asset_type === 'native' ? 'XLM' : (firstOp.asset_code || 'XLM');
                    to = firstOp.to || 'Unknown';
                  }
                }
                
                return {
                  id: tx.hash,
                  type: type,
                  amount: amount,
                  asset: asset,
                  from: tx.source_account,
                  to: to,
                  timestamp: tx.created_at,
                  hash: tx.hash,
                  memo: tx.memo,
                  fee: tx.fee_paid,
                  successful: tx.successful,
                  ledger: tx.ledger,
                  operation_count: tx.operation_count
                };
              } else {
                // Fallback if operations fetch fails
                return {
                  id: tx.hash,
                  type: 'payment',
                  amount: '0.000000',
                  asset: 'XLM',
                  from: tx.source_account,
                  to: 'Unknown',
                  timestamp: tx.created_at,
                  hash: tx.hash,
                  memo: tx.memo,
                  fee: tx.fee_paid,
                  successful: tx.successful,
                  ledger: tx.ledger,
                  operation_count: tx.operation_count
                };
              }
            } catch (opError) {
              console.error('Error fetching operations for transaction:', opError);
              // Return basic transaction data if operations fetch fails
              return {
                id: tx.hash,
                type: 'payment',
                amount: '0.000000',
                asset: 'XLM',
                from: tx.source_account,
                to: 'Unknown',
                timestamp: tx.created_at,
                hash: tx.hash,
                memo: tx.memo,
                fee: tx.fee_paid,
                successful: tx.successful,
                ledger: tx.ledger,
                operation_count: tx.operation_count
              };
            }
          })
        );

        setRecentTransactions(processedTransactions as Transaction[]);
        console.log('Transaction history loaded:', processedTransactions);
        console.log('Number of transactions:', processedTransactions.length);
        console.log('First transaction:', processedTransactions[0]);
      } else {
        console.log('No transactions found');
        setRecentTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load transaction history when wallet data is available
  useEffect(() => {
    if (generatedWallet?.publicKey) {
      fetchTransactionHistory();
    }
  }, [generatedWallet?.publicKey]);

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

  const renderWalletSection = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Wallet Overview</h1>
        <p className="dashboard-subtitle">Your Stellar wallet information</p>
        <button 
          className="refresh-data-btn"
          onClick={handleRefreshData}
          disabled={isDataLoading()}
        >
          {isDataLoading() ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error Display */}
      {hasErrors() && (
        <div className="error-banner">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div className="error-content">
            <h3>Some data failed to load</h3>
            <div className="error-list">
              {getAllErrors().map((error, index) => (
                <span key={index} className="error-item">
                  {error.type}: {error.error}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Generated Wallet Info Card */}
        {walletLoading ? (
          <div className="dashboard-card generated-wallet-card">
            <h3 className="card-title">Generated Wallet</h3>
            <div className="wallet-details">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading wallet data...
                </span>
              </div>
            </div>
          </div>
        ) : walletError ? (
          <div className="dashboard-card generated-wallet-card error-card">
            <h3 className="card-title">Generated Wallet</h3>
            <div className="wallet-details">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value error-text">Failed to load wallet data</span>
              </div>
              <div className="detail-item">
                <button 
                  className="retry-btn"
                  onClick={fetchWalletData}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : walletData ? (
          <div className="dashboard-card generated-wallet-card">
            <h3 className="card-title">Generated Wallet</h3>
            <div className="wallet-details">
              {/* Username Display */}
              <div className="detail-item">
                <span className="detail-label">Username:</span>
                <span className="detail-value">
                  {userProfileLoading ? (
                    <span className="loading-text">Loading...</span>
                  ) : userProfile?.username ? (
                    <span className="username-value">@{userProfile.username}</span>
                  ) : (
                    <span className="no-username">Not set</span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Public Key:</span>
                <span className="detail-value">{formatAddress(walletData.publicKey)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Network:</span>
                <span className="detail-value">{walletData.network}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">XLM Balance:</span>
                <span className="detail-value balance-value">
                  {getXlmBalance()} XLM
                </span>
              </div>
              
              {/* Transaction Count Display */}
              <div className="detail-item">
                <span className="detail-label">Recent Transactions:</span>
                <span className="detail-value">
                  {recentTransactions.length} transactions loaded
                </span>
              </div>

            </div>
          </div>
        ) : (
          <div className="dashboard-card generated-wallet-card">
            <h3 className="card-title">Generated Wallet</h3>
            <div className="wallet-details">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">No wallet data available</span>
              </div>
              <div className="detail-item">
                <button 
                  className="refresh-balance-btn"
                  onClick={fetchWalletData}
                >
                  <RefreshCw className="w-4 h-4" />
                  Load Wallet Data
                </button>
              </div>
            </div>
          </div>
        )}

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
              <div className="analytics-value">{recentTransactions.length}</div>
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
        <button 
          className="refresh-data-btn"
          onClick={fetchTransactionHistory}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Refresh Transactions</span>
        </button>
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
              {recentTransactions.map((tx: Transaction) => (
                <div key={tx.id} className="transaction-item">
                  <div className="transaction-icon">
                    {tx.type === 'payment' ? <Send size={20} /> : <CreditCard size={20} />}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-type">{tx.type}</div>
                    <div className="transaction-amount">
                      {tx.amount} {tx.asset || 'XLM'}
                    </div>
                  </div>
                  <div className="transaction-meta">
                    <div className="transaction-date">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                    <div className="transaction-address">
                      {formatAddress(tx.to || 'Unknown')}
                    </div>
                    {tx.ledger && (
                      <div className="transaction-ledger">
                        Ledger: {tx.ledger}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No recent transactions found</p>
              <button 
                className="fetch-transactions-btn"
                onClick={fetchTransactionHistory}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Fetch Transactions</span>
              </button>
            </div>
          )}
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
            className={`sidebar-nav-item ${activeSection === 'payment-links' ? 'active' : ''}`}
            onClick={() => {
              setActiveSection('payment-links');
              closeSidebar();
            }}
          >
            <Link size={20} />
            <span>Payment Links</span>
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
             activeSection === 'transactions' ? 'Transaction History' : 'Payment Links'}
          </h1>
        </div>

        {/* Content */}
        {activeSection === 'wallet' ? renderWalletSection() : 
         activeSection === 'transactions' ? renderTransactionsSection() :
         <PaymentLinks />}
      </main>
    </div>
  );
};

export default Dashboard; 