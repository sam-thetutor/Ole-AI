# Data Store Documentation

This document describes the enhanced data store implementation for the Dasta application, which provides centralized state management for all application data including metrics, user profiles, wallet data, transactions, payment links, and chat functionality.

## Overview

The data store is built using Zustand and provides:

- **Centralized State Management**: All application data in one place
- **Caching & Freshness**: Automatic caching with configurable stale times
- **Error Handling**: Comprehensive error states and fallbacks
- **Type Safety**: Full TypeScript support with exported types
- **Specialized Hooks**: Easy-to-use hooks for different data types
- **Real-time Updates**: Automatic data refresh and synchronization

## Architecture

```
src/
├── stores/
│   ├── dataStore.ts          # Main Zustand store
│   └── README.md            # This documentation
├── hooks/
│   ├── useDataStore.ts      # Enhanced hooks with utilities
│   └── index.ts             # Hook exports
└── components/
    └── common/
        └── DataStoreExample/ # Example implementation
```

## Data Types

### Core Types

```typescript
// Metrics data
interface MetricsData {
  totalPrompts: number;
  totalPayments: number;
  totalWalletCreations: number;
  totalFundings: number;
  totalTransfers: number;
  promptsToday: number;
  promptsThisWeek: number;
  promptsThisMonth: number;
}

// User profile
interface UserProfile {
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

// Wallet data
interface WalletData {
  publicKey: string;
  network: string;
  balances: WalletBalance[];
  createdAt: string;
  lastBalanceCheck: string;
}

// Transaction data
interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset?: string;
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

// Payment link data
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
  paidAt?: string;
  payer?: string;
}

// Chat data
interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
  userId: string;
  tools?: string[];
}

interface ChatTool {
  name: string;
  description: string;
  parameters?: any;
}
```

## Usage

### Basic Usage

```typescript
import { useDataStore } from '../stores/dataStore';

const MyComponent = () => {
  const { 
    metrics, 
    metricsLoading, 
    metricsError, 
    fetchMetrics 
  } = useDataStore();

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (metricsLoading) return <div>Loading...</div>;
  if (metricsError) return <div>Error: {metricsError}</div>;
  
  return (
    <div>
      <h2>Total Prompts: {metrics?.totalPrompts}</h2>
    </div>
  );
};
```

### Using Specialized Hooks

```typescript
import { 
  useMetrics, 
  useWallet, 
  useTransactions, 
  usePaymentLinks, 
  useChat 
} from '../hooks';

const Dashboard = () => {
  // Metrics hook
  const { metrics, loading: metricsLoading, error: metricsError } = useMetrics();
  
  // Wallet hook
  const { walletData, loading: walletLoading, error: walletError } = useWallet();
  
  // Transactions hook (with pagination)
  const { transactions, loading: txLoading, pagination } = useTransactions(10, 0);
  
  // Payment links hook
  const { paymentLinks, loading: linksLoading, createPaymentLink } = usePaymentLinks();
  
  // Chat hook
  const { chatMessages, sendChatMessage } = useChat();

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

### Using the Enhanced Hook

```typescript
import { useDataStoreHook } from '../hooks';

const AdvancedComponent = () => {
  const {
    // Store state
    metrics,
    userProfile,
    walletData,
    transactions,
    paymentLinks,
    chatMessages,
    
    // Utility functions
    refreshAllData,
    refreshUserData,
    isAuthenticated,
    getXlmBalance,
    getRecentTransactions,
    getPendingPaymentLinks,
    getUserRank,
    getUserScore,
    isLoading,
    hasErrors,
    getAllErrors,
    clearAllErrors,
    getDataFreshness,
    isDataStale
  } = useDataStoreHook();

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <div>Please connect your wallet</div>;
  }

  // Get user's XLM balance
  const balance = getXlmBalance();
  
  // Get recent transactions
  const recentTxs = getRecentTransactions(5);
  
  // Get pending payment links
  const pendingLinks = getPendingPaymentLinks();
  
  // Get user's leaderboard rank
  const weeklyRank = getUserRank('weekly');
  const weeklyScore = getUserScore('weekly');

  return (
    <div>
      <h2>Balance: {balance} XLM</h2>
      <h3>Weekly Rank: {weeklyRank}</h3>
      <h3>Weekly Score: {weeklyScore}</h3>
      
      <button onClick={refreshAllData} disabled={isLoading()}>
        Refresh All Data
      </button>
      
      {hasErrors() && (
        <div>
          <h3>Errors:</h3>
          {getAllErrors().map((error, index) => (
            <div key={index}>{error.type}: {error.error}</div>
          ))}
          <button onClick={clearAllErrors}>Clear Errors</button>
        </div>
      )}
    </div>
  );
};
```

## API Reference

### Store Actions

#### Data Fetching
- `fetchMetrics()` - Fetch platform metrics
- `fetchLeaderboard()` - Fetch leaderboard data
- `fetchUserProfile()` - Fetch user profile
- `fetchWalletData()` - Fetch wallet information
- `fetchTransactions(limit?, offset?)` - Fetch transaction history
- `fetchPaymentLinks()` - Fetch user's payment links
- `fetchChatTools()` - Fetch available chat tools

#### Data Manipulation
- `sendChatMessage(message)` - Send a chat message
- `createPaymentLink(data)` - Create a new payment link
- `payFixedLink(linkId, amount)` - Pay a fixed payment link
- `contributeToGlobalLink(linkId, amount)` - Contribute to a global link
- `sendPayment(toAddress, amount, asset?, memo?)` - Send a payment

#### Cache Management
- `clearCache()` - Clear all cached data
- `clearUserData()` - Clear user-specific data (for logout)
- `isDataStale(lastFetched, staleTime?)` - Check if data is stale

### Utility Functions (from useDataStoreHook)

#### Data Access
- `getXlmBalance()` - Get formatted XLM balance
- `getFormattedBalance(assetType)` - Get balance for specific asset
- `getRecentTransactions(limit)` - Get recent transactions
- `getPendingPaymentLinks()` - Get pending payment links
- `getPaidPaymentLinks()` - Get paid payment links
- `getFixedPaymentLinks()` - Get fixed payment links
- `getGlobalPaymentLinks()` - Get global payment links

#### User Information
- `getUserRank(type)` - Get user's leaderboard rank
- `getUserScore(type)` - Get user's leaderboard score
- `isAuthenticated()` - Check if user is authenticated

#### Status & Health
- `isLoading()` - Check if any data is loading
- `hasErrors()` - Check if there are any errors
- `getAllErrors()` - Get all current errors
- `getDataFreshness()` - Get data freshness timestamps
- `isDataStale(dataType)` - Check if specific data is stale

#### Data Management
- `refreshAllData()` - Refresh all data
- `refreshUserData()` - Refresh user-specific data
- `clearAllErrors()` - Clear all errors

## Configuration

### Cache Duration

The default cache duration is 5 minutes. You can customize this:

```typescript
// In dataStore.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Or check with custom stale time
const isStale = store.isDataStale(lastFetched, 10 * 60 * 1000); // 10 minutes
```

### API Endpoints

The store uses the following API endpoints:

- `GET /api/metrics/summary` - Platform metrics
- `GET /api/auth/profile` - User profile
- `GET /api/wallet` - Wallet data
- `GET /api/wallet/transactions` - Transaction history
- `GET /api/payment-links/user` - User's payment links
- `GET /api/chat/tools` - Chat tools
- `POST /api/chat/send` - Send chat message
- `POST /api/payment-links` - Create payment link
- `POST /api/payment-links/:id/pay` - Pay fixed link
- `POST /api/payment-links/:id/contribute` - Contribute to global link
- `POST /api/wallet/send` - Send payment

## Error Handling

The store provides comprehensive error handling:

```typescript
const { 
  metricsError, 
  walletError, 
  transactionsError,
  hasErrors,
  getAllErrors 
} = useDataStoreHook();

// Check for specific errors
if (metricsError) {
  console.error('Metrics error:', metricsError);
}

// Check for any errors
if (hasErrors()) {
  const errors = getAllErrors();
  errors.forEach(({ type, error }) => {
    console.error(`${type} error:`, error);
  });
}
```

## Fallback Data

The store includes mock data as fallbacks when API calls fail:

```typescript
// Mock metrics data
const mockMetricsData: MetricsData = {
  totalPrompts: 1247,
  totalPayments: 856,
  totalWalletCreations: 342,
  // ... more data
};

// Mock leaderboard data
const mockLeaderboardData: LeaderboardData = {
  weekly: [/* leaderboard entries */],
  monthly: [/* leaderboard entries */]
};

// Mock chat tools
const mockChatTools: ChatTool[] = [
  { name: 'get_balance', description: 'Get wallet balance' },
  // ... more tools
];
```

## Best Practices

### 1. Use Specialized Hooks for Specific Data

```typescript
// ✅ Good - Use specialized hooks
const { metrics, loading, error } = useMetrics();
const { walletData } = useWallet();

// ❌ Avoid - Using main store for everything
const { metrics, walletData } = useDataStore();
```

### 2. Handle Loading and Error States

```typescript
const { metrics, loading, error } = useMetrics();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!metrics) return <EmptyState />;

return <MetricsDisplay metrics={metrics} />;
```

### 3. Use Utility Functions for Data Access

```typescript
// ✅ Good - Use utility functions
const balance = getXlmBalance();
const recentTxs = getRecentTransactions(5);
const pendingLinks = getPendingPaymentLinks();

// ❌ Avoid - Manual filtering
const balance = walletData?.balances?.find(b => b.asset_type === 'native')?.balance;
```

### 4. Refresh Data Appropriately

```typescript
// Refresh all data when needed
const handleRefresh = () => {
  refreshAllData();
};

// Refresh only user data
const handleUserAction = () => {
  refreshUserData();
};
```

### 5. Check Data Freshness

```typescript
const { getDataFreshness, isDataStale } = useDataStoreHook();

// Check if specific data is stale
if (isDataStale('wallet')) {
  // Refresh wallet data
  fetchWalletData();
}

// Get all freshness info
const freshness = getDataFreshness();
console.log('Metrics age:', freshness.metrics);
```

## Example Implementation

See `src/components/common/DataStoreExample/` for a complete example implementation that demonstrates all features of the data store.

## Migration from Existing Code

If you're migrating from existing API calls:

### Before (Direct API calls)
```typescript
const [metrics, setMetrics] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/metrics/summary');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchMetrics();
}, []);
```

### After (Using data store)
```typescript
const { metrics, loading, error } = useMetrics();
```

The data store handles caching, error handling, and automatic refresh, making your components much simpler and more reliable.

## Troubleshooting

### Common Issues

1. **Data not updating**: Check if data is stale using `isDataStale()`
2. **Authentication errors**: Ensure user is authenticated with `isAuthenticated()`
3. **API errors**: Check error states and use fallback data
4. **Performance issues**: Use specialized hooks instead of the main store

### Debug Mode

Enable debug logging by checking the browser console for data store operations.

## Contributing

When adding new data types or functionality:

1. Add new interfaces to the store
2. Add corresponding state and actions
3. Create specialized hooks if needed
4. Add utility functions to `useDataStoreHook`
5. Update this documentation
6. Add example usage to `DataStoreExample` 