import { useEffect, useCallback } from 'react';
import { useDataStore } from '../stores/dataStore';

// Hook for accessing data store with additional utilities
export const useDataStoreHook = () => {
  const store = useDataStore();

  // Auto-refresh data when component mounts
  useEffect(() => {
    // Fetch essential data on mount
    store.fetchMetrics();
    store.fetchLeaderboard();
  }, []);

  // Utility function to refresh all data
  const refreshAllData = useCallback(async () => {
    await Promise.all([
      store.fetchMetrics(),
      store.fetchLeaderboard(),
      store.fetchUserProfile(),
      store.fetchWalletData(),
      store.fetchTransactions(),
      store.fetchPaymentLinks(),
      store.fetchChatTools()
    ]);
  }, [store]);

  // Utility function to refresh user-specific data
  const refreshUserData = useCallback(async () => {
    await Promise.all([
      store.fetchUserProfile(),
      store.fetchWalletData(),
      store.fetchTransactions(),
      store.fetchPaymentLinks()
    ]);
  }, [store]);

  // Utility function to check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return store.isAuthenticated ? store.isAuthenticated() : !!localStorage.getItem('accessToken');
  }, [store.isAuthenticated]);

  // Utility function to get formatted balance
  const getFormattedBalance = useCallback((assetType: string = 'native') => {
    if (!store.walletData?.balances) return '0.000000';
    
    const balance = store.walletData.balances.find(b => 
      assetType === 'native' ? b.asset_type === 'native' : b.asset_code === assetType
    );
    
    return balance?.balance || '0.000000';
  }, [store.walletData]);

  // Utility function to get XLM balance
  const getXlmBalance = useCallback(() => {
    return getFormattedBalance('native');
  }, [getFormattedBalance]);

  // Utility function to get recent transactions
  const getRecentTransactions = useCallback((limit: number = 5) => {
    return store.transactions.slice(0, limit);
  }, [store.transactions]);

  // Utility function to get pending payment links
  const getPendingPaymentLinks = useCallback(() => {
    return store.paymentLinks.filter(link => link.status === 'pending');
  }, [store.paymentLinks]);

  // Utility function to get paid payment links
  const getPaidPaymentLinks = useCallback(() => {
    return store.paymentLinks.filter(link => link.status === 'paid');
  }, [store.paymentLinks]);

  // Utility function to get fixed payment links
  const getFixedPaymentLinks = useCallback(() => {
    return store.paymentLinks.filter(link => link.type === 'fixed');
  }, [store.paymentLinks]);

  // Utility function to get global payment links
  const getGlobalPaymentLinks = useCallback(() => {
    return store.paymentLinks.filter(link => link.type === 'global');
  }, [store.paymentLinks]);

  // Utility function to get user's rank in leaderboard
  const getUserRank = useCallback((type: 'weekly' | 'monthly' = 'weekly') => {
    if (!store.leaderboard || !store.userProfile) return null;
    
    const leaderboardData = store.leaderboard[type];
    const userEntry = leaderboardData.find(entry => 
      entry.address === store.userProfile?.walletAddress
    );
    
    return userEntry?.rank || null;
  }, [store.leaderboard, store.userProfile]);

  // Utility function to get user's score
  const getUserScore = useCallback((type: 'weekly' | 'monthly' = 'weekly') => {
    if (!store.leaderboard || !store.userProfile) return 0;
    
    const leaderboardData = store.leaderboard[type];
    const userEntry = leaderboardData.find(entry => 
      entry.address === store.userProfile?.walletAddress
    );
    
    return userEntry?.score || 0;
  }, [store.leaderboard, store.userProfile]);

  // Utility function to check if data is loading
  const isLoading = useCallback(() => {
    return store.metricsLoading || 
           store.leaderboardLoading || 
           store.userProfileLoading || 
           store.walletLoading || 
           store.transactionsLoading || 
           store.paymentLinksLoading || 
           store.chatLoading;
  }, [store]);

  // Utility function to check if there are any errors
  const hasErrors = useCallback(() => {
    return !!(store.metricsError || 
              store.leaderboardError || 
              store.userProfileError || 
              store.walletError || 
              store.transactionsError || 
              store.paymentLinksError || 
              store.chatError);
  }, [store]);

  // Utility function to get all errors
  const getAllErrors = useCallback(() => {
    const errors = [];
    if (store.metricsError) errors.push({ type: 'metrics', error: store.metricsError });
    if (store.leaderboardError) errors.push({ type: 'leaderboard', error: store.leaderboardError });
    if (store.userProfileError) errors.push({ type: 'userProfile', error: store.userProfileError });
    if (store.walletError) errors.push({ type: 'wallet', error: store.walletError });
    if (store.transactionsError) errors.push({ type: 'transactions', error: store.transactionsError });
    if (store.paymentLinksError) errors.push({ type: 'paymentLinks', error: store.paymentLinksError });
    if (store.chatError) errors.push({ type: 'chat', error: store.chatError });
    return errors;
  }, [store]);

  // Utility function to clear all errors
  const clearAllErrors = useCallback(() => {
    store.clearCache();
  }, [store]);

  // Utility function to get data freshness status
  const getDataFreshness = useCallback(() => {
    const now = Date.now();
    const freshness = {
      metrics: store.metricsLastFetched ? now - store.metricsLastFetched : null,
      leaderboard: store.leaderboardLastFetched ? now - store.leaderboardLastFetched : null,
      userProfile: store.userProfileLastFetched ? now - store.userProfileLastFetched : null,
      wallet: store.walletLastFetched ? now - store.walletLastFetched : null,
      transactions: store.transactionsLastFetched ? now - store.transactionsLastFetched : null,
      paymentLinks: store.paymentLinksLastFetched ? now - store.paymentLinksLastFetched : null,
      chat: store.chatLastFetched ? now - store.chatLastFetched : null
    };
    
    return freshness;
  }, [store]);

  // Utility function to check if specific data is stale
  const isDataStale = useCallback((dataType: keyof ReturnType<typeof getDataFreshness>) => {
    if (!store.isDataStale) return true;
    const freshness = getDataFreshness();
    const age = freshness[dataType];
    return age === null || age > 5 * 60 * 1000; // 5 minutes
  }, [getDataFreshness, store.isDataStale]);

  return {
    // Store state
    ...store,
    
    // Utility functions
    refreshAllData,
    refreshUserData,
    isAuthenticated,
    getFormattedBalance,
    getXlmBalance,
    getRecentTransactions,
    getPendingPaymentLinks,
    getPaidPaymentLinks,
    getFixedPaymentLinks,
    getGlobalPaymentLinks,
    getUserRank,
    getUserScore,
    isLoading,
    hasErrors,
    getAllErrors,
    clearAllErrors,
    getDataFreshness,
    isDataStale
  };
};

// Specialized hooks for specific data types
export const useMetrics = () => {
  const store = useDataStore();
  
  useEffect(() => {
    store.fetchMetrics();
  }, []);
  
  return {
    metrics: store.metrics,
    loading: store.metricsLoading,
    error: store.metricsError,
    fetchMetrics: store.fetchMetrics,
    isStale: store.isDataStale ? store.isDataStale(store.metricsLastFetched) : true
  };
};

export const useLeaderboard = () => {
  const store = useDataStore();
  
  useEffect(() => {
    store.fetchLeaderboard();
  }, []);
  
  return {
    leaderboard: store.leaderboard,
    loading: store.leaderboardLoading,
    error: store.leaderboardError,
    fetchLeaderboard: store.fetchLeaderboard,
    isStale: store.isDataStale ? store.isDataStale(store.leaderboardLastFetched) : true
  };
};

export const useUserProfile = () => {
  const store = useDataStore();
  
  useEffect(() => {
    if (store.isAuthenticated && store.isAuthenticated()) {
      store.fetchUserProfile();
    }
  }, []);
  
  return {
    userProfile: store.userProfile,
    loading: store.userProfileLoading,
    error: store.userProfileError,
    fetchUserProfile: store.fetchUserProfile,
    isStale: store.isDataStale ? store.isDataStale(store.userProfileLastFetched) : true
  };
};

export const useWallet = () => {
  const store = useDataStore();
  
  useEffect(() => {
    if (store.isAuthenticated && store.isAuthenticated()) {
      store.fetchWalletData();
    }
  }, []);
  
  return {
    walletData: store.walletData,
    loading: store.walletLoading,
    error: store.walletError,
    fetchWalletData: store.fetchWalletData,
    isStale: store.isDataStale ? store.isDataStale(store.walletLastFetched) : true
  };
};

export const useTransactions = (limit: number = 10, offset: number = 0) => {
  const store = useDataStore();
  
  useEffect(() => {
    if (store.isAuthenticated && store.isAuthenticated()) {
      store.fetchTransactions(limit, offset);
    }
  }, [limit, offset]);
  
  return {
    transactions: store.transactions,
    loading: store.transactionsLoading,
    error: store.transactionsError,
    pagination: store.transactionsPagination,
    fetchTransactions: store.fetchTransactions,
    isStale: store.isDataStale ? store.isDataStale(store.transactionsLastFetched) : true
  };
};

export const usePaymentLinks = () => {
  const store = useDataStore();
  
  useEffect(() => {
    if (store.isAuthenticated && store.isAuthenticated()) {
      store.fetchPaymentLinks();
    }
  }, []);
  
  return {
    paymentLinks: store.paymentLinks,
    loading: store.paymentLinksLoading,
    error: store.paymentLinksError,
    fetchPaymentLinks: store.fetchPaymentLinks,
    createPaymentLink: store.createPaymentLink,
    payFixedLink: store.payFixedLink,
    contributeToGlobalLink: store.contributeToGlobalLink,
    isStale: store.isDataStale ? store.isDataStale(store.paymentLinksLastFetched) : true
  };
};

export const useChat = () => {
  const store = useDataStore();
  
  useEffect(() => {
    if (store.isAuthenticated && store.isAuthenticated()) {
      store.fetchChatTools();
    }
  }, []);
  
  return {
    chatMessages: store.chatMessages,
    chatTools: store.chatTools,
    loading: store.chatLoading,
    error: store.chatError,
    fetchChatTools: store.fetchChatTools,
    sendChatMessage: store.sendChatMessage,
    isStale: store.isDataStale ? store.isDataStale(store.chatLastFetched) : true
  };
}; 