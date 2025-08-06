import { create } from 'zustand';

// Types for metrics data
export interface MetricsData {
  totalPrompts: number;
  totalPayments: number;
  totalWalletCreations: number;
  totalFundings: number;
  totalTransfers: number;
  promptsToday: number;
  promptsThisWeek: number;
  promptsThisMonth: number;
}

// Types for leaderboard data
export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  address: string;
  score: number;
  transactions: number;
  volume: string;
  change: number;
}

export interface LeaderboardData {
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
}

// Types for user profile data
export interface UserProfile {
  walletAddress: string;
  username?: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  primaryWallet?: {
    publicKey: string;
    network: string;
    isActive: boolean;
  };
}

// Types for wallet data
export interface WalletBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
}

export interface WalletData {
  publicKey: string;
  network: string;
  balances: WalletBalance[];
  createdAt: string;
  lastBalanceCheck: string;
}

// Types for transaction data
export interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset?: string;
  fromAsset?: string;
  toAsset?: string;
  from?: string;
  to?: string;
  timestamp: string;
  status: string;
  hash?: string;
  memo?: string;
  fee?: string;
  successful?: boolean;
  ledger?: number;
  operation_count?: number;
}

// Types for payment link data
export interface PaymentLinkData {
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
  paidAt?: string;
  payer?: string;
}

// Types for chat data
export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  userId: string;
  tools?: string[];
}

export interface ChatTool {
  name: string;
  description: string;
  parameters?: any;
}

// Store state interface
interface DataStoreState {
  // Metrics data
  metrics: MetricsData | null;
  metricsLoading: boolean;
  metricsError: string | null;
  metricsLastFetched: number | null;
  
  // Leaderboard data
  leaderboard: LeaderboardData | null;
  leaderboardLoading: boolean;
  leaderboardError: string | null;
  leaderboardLastFetched: number | null;
  
  // User profile data
  userProfile: UserProfile | null;
  userProfileLoading: boolean;
  userProfileError: string | null;
  userProfileLastFetched: number | null;
  
  // Wallet data
  walletData: WalletData | null;
  walletLoading: boolean;
  walletError: string | null;
  walletLastFetched: number | null;
  
  // Transaction data
  transactions: Transaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsLastFetched: number | null;
  transactionsPagination: {
    limit: number;
    offset: number;
    total: number;
  };
  
  // Payment links data
  paymentLinks: PaymentLinkData[];
  paymentLinksLoading: boolean;
  paymentLinksError: string | null;
  paymentLinksLastFetched: number | null;
  
  // Chat data
  chatMessages: ChatMessage[];
  chatTools: ChatTool[];
  chatLoading: boolean;
  chatError: string | null;
  chatLastFetched: number | null;
  
  // Actions
  fetchMetrics: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchWalletData: () => Promise<void>;
  fetchTransactions: (limit?: number, offset?: number) => Promise<void>;
  fetchPaymentLinks: () => Promise<void>;
  fetchChatTools: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<ChatMessage | null>;
  createPaymentLink: (data: Partial<PaymentLinkData>) => Promise<PaymentLinkData | null>;
  payFixedLink: (linkId: string, amount: number) => Promise<boolean>;
  contributeToGlobalLink: (linkId: string, amount: number) => Promise<boolean>;
  sendPayment: (toAddress: string, amount: string, asset?: string, memo?: string) => Promise<boolean>;
  clearCache: () => void;
  clearUserData: () => void;
  isDataStale: (lastFetched: number | null, staleTime?: number) => boolean;
  isAuthenticated: () => boolean;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Mock leaderboard data (fallback)
const mockLeaderboardData: LeaderboardData = {
  weekly: [
    { id: '1', rank: 1, username: 'CryptoKing', address: 'GCUE26...F4JN', score: 9850, transactions: 127, volume: '125,430 XLM', change: 12.5 },
    { id: '2', rank: 2, username: 'StellarPro', address: 'GB7XY...K9LM', score: 8740, transactions: 98, volume: '98,750 XLM', change: 8.3 },
    { id: '3', rank: 3, username: 'BlockchainQueen', address: 'GD3KJ...P2QR', score: 7620, transactions: 85, volume: '87,320 XLM', change: -2.1 },
    { id: '4', rank: 4, username: 'XLMWhale', address: 'GA5X4...M8ST', score: 6540, transactions: 72, volume: '76,890 XLM', change: 15.7 },
    { id: '5', rank: 5, username: 'DeFiMaster', address: 'GC9KL...N4UV', score: 5890, transactions: 63, volume: '65,420 XLM', change: 5.2 },
    { id: '6', rank: 6, username: 'StellarTrader', address: 'GD2MN...Q7RS', score: 5230, transactions: 58, volume: '58,340 XLM', change: 3.8 },
    { id: '7', rank: 7, username: 'CryptoVault', address: 'GC8KL...T9WX', score: 4870, transactions: 52, volume: '52,180 XLM', change: -1.2 },
    { id: '8', rank: 8, username: 'XLMInvestor', address: 'GA7XY...H5VZ', score: 4450, transactions: 47, volume: '48,920 XLM', change: 7.4 },
    { id: '9', rank: 9, username: 'BlockchainPro', address: 'GD4KJ...L8MN', score: 4120, transactions: 43, volume: '45,670 XLM', change: 2.1 },
    { id: '10', rank: 10, username: 'StellarElite', address: 'GC6KL...P3QR', score: 3890, transactions: 41, volume: '42,150 XLM', change: -0.8 },
  ],
  monthly: [
    { id: '1', rank: 1, username: 'CryptoKing', address: 'GCUE26...F4JN', score: 45230, transactions: 589, volume: '567,890 XLM', change: 18.7 },
    { id: '2', rank: 2, username: 'StellarPro', address: 'GB7XY...K9LM', score: 39870, transactions: 445, volume: '498,750 XLM', change: 12.3 },
    { id: '3', rank: 3, username: 'BlockchainQueen', address: 'GD3KJ...P2QR', score: 34560, transactions: 398, volume: '432,100 XLM', change: -1.5 },
    { id: '4', rank: 4, username: 'XLMWhale', address: 'GA5X4...M8ST', score: 29890, transactions: 325, volume: '345,670 XLM', change: 22.1 },
    { id: '5', rank: 5, username: 'DeFiMaster', address: 'GC9KL...N4UV', score: 26780, transactions: 289, volume: '298,450 XLM', change: 8.9 },
    { id: '6', rank: 6, username: 'StellarTrader', address: 'GD2MN...Q7RS', score: 23450, transactions: 267, volume: '267,890 XLM', change: 15.3 },
    { id: '7', rank: 7, username: 'CryptoVault', address: 'GC8KL...T9WX', score: 21230, transactions: 245, volume: '245,120 XLM', change: -2.7 },
    { id: '8', rank: 8, username: 'XLMInvestor', address: 'GA7XY...H5VZ', score: 19870, transactions: 223, volume: '223,450 XLM', change: 11.8 },
    { id: '9', rank: 9, username: 'BlockchainPro', address: 'GD4KJ...L8MN', score: 18450, transactions: 198, volume: '198,670 XLM', change: 6.4 },
    { id: '10', rank: 10, username: 'StellarElite', address: 'GC6KL...P3QR', score: 17230, transactions: 187, volume: '187,890 XLM', change: -0.5 },
  ]
};

// Mock metrics data (fallback)
const mockMetricsData: MetricsData = {
  totalPrompts: 1247,
  totalPayments: 856,
  totalWalletCreations: 342,
  totalFundings: 1234,
  totalTransfers: 890,
  promptsToday: 45,
  promptsThisWeek: 234,
  promptsThisMonth: 567
};

// Mock chat tools data
const mockChatTools: ChatTool[] = [
  { name: 'get_balance', description: 'Get wallet balance for a specific address' },
  { name: 'send_payment', description: 'Send a payment to another wallet address' },
  { name: 'get_transactions', description: 'Get transaction history for a wallet' },
  { name: 'create_payment_link', description: 'Create a new payment link' },
  { name: 'get_username', description: 'Get username for a wallet address' }
];

export const useDataStore = create<DataStoreState>((set, get) => ({
  // Initial state
  metrics: null,
  metricsLoading: false,
  metricsError: null,
  metricsLastFetched: null,
  
  leaderboard: null,
  leaderboardLoading: false,
  leaderboardError: null,
  leaderboardLastFetched: null,
  
  userProfile: null,
  userProfileLoading: false,
  userProfileError: null,
  userProfileLastFetched: null,
  
  walletData: null,
  walletLoading: false,
  walletError: null,
  walletLastFetched: null,
  
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsLastFetched: null,
  transactionsPagination: {
    limit: 10,
    offset: 0,
    total: 0
  },
  
  paymentLinks: [],
  paymentLinksLoading: false,
  paymentLinksError: null,
  paymentLinksLastFetched: null,
  
  chatMessages: [],
  chatTools: [],
  chatLoading: false,
  chatError: null,
  chatLastFetched: null,
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
  
  // Helper function to check if data is stale
  isDataStale: (lastFetched: number | null, staleTime: number = CACHE_DURATION) => {
    if (!lastFetched) return true;
    return Date.now() - lastFetched > staleTime;
  },
  
  // Fetch metrics from API
  fetchMetrics: async () => {
    const { metrics, metricsLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (metrics && !isDataStale(metricsLastFetched)) {
      return;
    }
    
    set({ metricsLoading: true, metricsError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/metrics/summary');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch metrics`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          metrics: data.data,
          metricsLastFetched: Date.now(),
          metricsLoading: false,
          metricsError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      
      // Use mock data as fallback
      set({
        metrics: mockMetricsData,
        metricsLastFetched: Date.now(),
        metricsLoading: false,
        metricsError: 'Using cached data due to API error'
      });
    }
  },
  
  // Fetch leaderboard data
  fetchLeaderboard: async () => {
    const { leaderboard, leaderboardLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (leaderboard && !isDataStale(leaderboardLastFetched)) {
      return;
    }
    
    set({ leaderboardLoading: true, leaderboardError: null });
    
    try {
      // For now, we'll use mock data since the backend doesn't have a leaderboard endpoint
      // In the future, this would fetch from the API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      set({
        leaderboard: mockLeaderboardData,
        leaderboardLastFetched: Date.now(),
        leaderboardLoading: false,
        leaderboardError: null
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      
      // Use mock data as fallback
      set({
        leaderboard: mockLeaderboardData,
        leaderboardLastFetched: Date.now(),
        leaderboardLoading: false,
        leaderboardError: 'Using cached data due to API error'
      });
    }
  },
  
  // Fetch user profile
  fetchUserProfile: async () => {
    const { userProfile, userProfileLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (userProfile && !isDataStale(userProfileLastFetched)) {
      return;
    }
    
    set({ userProfileLoading: true, userProfileError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch user profile`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          userProfile: data.data,
          userProfileLastFetched: Date.now(),
          userProfileLoading: false,
          userProfileError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      set({
        userProfileLoading: false,
        userProfileError: 'Failed to fetch user profile'
      });
    }
  },
  
  // Fetch wallet data
  fetchWalletData: async () => {
    const { walletData, walletLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (walletData && !isDataStale(walletLastFetched)) {
      return;
    }
    
    set({ walletLoading: true, walletError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/wallet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch wallet data`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          walletData: data.data,
          walletLastFetched: Date.now(),
          walletLoading: false,
          walletError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      set({
        walletLoading: false,
        walletError: 'Failed to fetch wallet data'
      });
    }
  },
  
  // Fetch transactions
  fetchTransactions: async (limit: number = 10, offset: number = 0) => {
    const { transactions, transactionsLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh and same pagination
    if (transactions.length > 0 && !isDataStale(transactionsLastFetched) && 
        get().transactionsPagination.limit === limit && 
        get().transactionsPagination.offset === offset) {
      return;
    }
    
    set({ transactionsLoading: true, transactionsError: null });
    
    try {
      const response = await fetch(`http://localhost:3001/api/wallet/transactions?limit=${limit}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch transactions`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          transactions: data.data.transactions || [],
          transactionsPagination: data.data.pagination || { limit, offset, total: 0 },
          transactionsLastFetched: Date.now(),
          transactionsLoading: false,
          transactionsError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      set({
        transactionsLoading: false,
        transactionsError: 'Failed to fetch transactions'
      });
    }
  },
  
  // Fetch payment links
  fetchPaymentLinks: async () => {
    const { paymentLinks, paymentLinksLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (paymentLinks.length > 0 && !isDataStale(paymentLinksLastFetched)) {
      return;
    }
    
    set({ paymentLinksLoading: true, paymentLinksError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/payment-links/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch payment links`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          paymentLinks: data.data,
          paymentLinksLastFetched: Date.now(),
          paymentLinksLoading: false,
          paymentLinksError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching payment links:', error);
      set({
        paymentLinksLoading: false,
        paymentLinksError: 'Failed to fetch payment links'
      });
    }
  },
  
  // Fetch chat tools
  fetchChatTools: async () => {
    const { chatTools, chatLastFetched, isDataStale } = get();
    
    // Return cached data if it's still fresh
    if (chatTools.length > 0 && !isDataStale(chatLastFetched)) {
      return;
    }
    
    set({ chatLoading: true, chatError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/chat/tools', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch chat tools`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        set({
          chatTools: data.data.tools || [],
          chatLastFetched: Date.now(),
          chatLoading: false,
          chatError: null
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching chat tools:', error);
      
      // Use mock data as fallback
      set({
        chatTools: mockChatTools,
        chatLastFetched: Date.now(),
        chatLoading: false,
        chatError: 'Using cached data due to API error'
      });
    }
  },
  
  // Send chat message
  sendChatMessage: async (message: string) => {
    set({ chatLoading: true, chatError: null });
    
    try {
      const response = await fetch('http://localhost:3001/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to send chat message`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        const chatMessage: ChatMessage = {
          id: Date.now().toString(),
          message,
          response: data.data.response,
          timestamp: data.data.timestamp,
          userId: data.data.userId
        };
        
        set(state => ({
          chatMessages: [...state.chatMessages, chatMessage],
          chatLoading: false,
          chatError: null
        }));
        
        return chatMessage;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      set({
        chatLoading: false,
        chatError: 'Failed to send chat message'
      });
      return null;
    }
  },
  
  // Create payment link
  createPaymentLink: async (data: Partial<PaymentLinkData>) => {
    try {
      const response = await fetch('http://localhost:3001/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to create payment link`);
      }
      
      const responseData = await response.json();
      
      if (responseData.success && responseData.data) {
        // Add to local state
        set(state => ({
          paymentLinks: [...state.paymentLinks, responseData.data]
        }));
        
        return responseData.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
      return null;
    }
  },
  
  // Pay fixed link
  payFixedLink: async (linkId: string, amount: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment-links/${linkId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to pay fixed link`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh payment links to get updated status
        get().fetchPaymentLinks();
        return true;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error paying fixed link:', error);
      return false;
    }
  },
  
  // Contribute to global link
  contributeToGlobalLink: async (linkId: string, amount: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment-links/${linkId}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to contribute to global link`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh payment links to get updated status
        get().fetchPaymentLinks();
        return true;
      } else {
        throw new Error('Contribution failed');
      }
    } catch (error) {
      console.error('Error contributing to global link:', error);
      return false;
    }
  },
  
  // Send payment
  sendPayment: async (toAddress: string, amount: string, asset: string = 'XLM', memo: string = '') => {
    try {
      const response = await fetch('http://localhost:3001/api/wallet/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          toAddress,
          amount,
          asset,
          memo
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to send payment`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh wallet data and transactions
        get().fetchWalletData();
        get().fetchTransactions();
        return true;
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error sending payment:', error);
      return false;
    }
  },
  
  // Clear all cached data
  clearCache: () => {
    set({
      metrics: null,
      metricsLastFetched: null,
      leaderboard: null,
      leaderboardLastFetched: null,
      metricsError: null,
      leaderboardError: null
    });
  },
  
  // Clear user-specific data (for logout)
  clearUserData: () => {
    set({
      userProfile: null,
      userProfileLastFetched: null,
      userProfileError: null,
      walletData: null,
      walletLastFetched: null,
      walletError: null,
      transactions: [],
      transactionsLastFetched: null,
      transactionsError: null,
      transactionsPagination: { limit: 10, offset: 0, total: 0 },
      paymentLinks: [],
      paymentLinksLastFetched: null,
      paymentLinksError: null,
      chatMessages: [],
      chatTools: [],
      chatLastFetched: null,
      chatError: null
    });
  }
})); 