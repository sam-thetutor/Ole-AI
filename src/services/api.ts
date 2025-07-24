const API_BASE_URL = 'https://ole-backend-production.up.railway.app/api';
 //const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface TokenData {
  walletAddress: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

interface WalletBalance {
  walletAddress: string;
  balance: {
    XLM: string;
    USDC: string;
  };
  lastUpdated: string;
}

interface Transaction {
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
}

interface TransactionResponse {
  walletAddress: string;
  transactions: Transaction[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  address: string;
  score: number;
  change: number;
}

interface LeaderboardResponse {
  type: string;
  leaderboard: LeaderboardEntry[];
  lastUpdated: string;
}

class ApiService {
  private baseURL: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  // Set tokens
  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Clear tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Get auth headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Make API request
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle token expiration
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers = this.getAuthHeaders();
          const retryResponse = await fetch(url, config);
          return this.handleResponse<T>(retryResponse);
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error('Network error occurred');
    }
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.data.accessToken, this.refreshToken!);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  // Authentication methods
  async connectWallet(walletAddress: string, signature?: string): Promise<ApiResponse<TokenData>> {
    const response = await this.request<TokenData>('/auth/connect', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature }),
    });

    if (response.success && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  }

  async disconnectWallet(): Promise<void> {
    try {
      await this.request('/auth/disconnect', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async verifyToken(): Promise<{ valid: boolean; data?: any; error?: string }> {
    if (!this.accessToken) {
      return { valid: false };
    }

    try {
      const response = await this.request('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ token: this.accessToken }),
      });
      return { valid: true, data: response.data };
    } catch (error) {
      return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // API methods
  async getProfile(): Promise<ApiResponse<{ walletAddress: string; connectedAt: string }>> {
    return await this.request<{ walletAddress: string; connectedAt: string }>('/profile');
  }

  async getWalletBalance(): Promise<ApiResponse<WalletBalance>> {
    return await this.request<WalletBalance>('/wallet/balance');
  }

  async getTransactions(limit: number = 10, offset: number = 0): Promise<ApiResponse<TransactionResponse>> {
    return await this.request<TransactionResponse>(`/wallet/transactions?limit=${limit}&offset=${offset}`);
  }

  async sendPayment(toAddress: string, amount: string, asset: string = 'XLM', memo: string = ''): Promise<ApiResponse<any>> {
    return await this.request('/wallet/send', {
      method: 'POST',
      body: JSON.stringify({
        walletAddress: this.getWalletAddressFromToken(),
        toAddress,
        amount,
        asset,
        memo,
      }),
    });
  }

  async getLeaderboard(type: string = 'weekly'): Promise<ApiResponse<LeaderboardResponse>> {
    return await this.request<LeaderboardResponse>(`/leaderboard?type=${type}`);
  }

  // Utility method to get wallet address from token
  getWalletAddressFromToken(): string | null {
    if (!this.accessToken) return null;
    
    try {
      const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
      return payload.walletAddress;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 