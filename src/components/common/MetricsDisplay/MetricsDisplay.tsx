import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, Users, Activity } from 'lucide-react';
import apiService from '../../../services/api';
import './MetricsDisplay.css';

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

const MetricsDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      // Use the backend URL directly since this is a public endpoint
      const response = await fetch('http://localhost:3001/api/metrics/summary');
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      
      const data = await response.json();
      setMetrics(data.data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="metrics-section">
        <div className="metrics-container">
          <h2 className="metrics-title">Platform Metrics</h2>
          <div className="metrics-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="metric-card loading">
                <div className="metric-skeleton"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="metrics-section">
        <div className="metrics-container">
          <h2 className="metrics-title">Platform Metrics</h2>
          <div className="metrics-error">
            <p>Unable to load metrics at this time</p>
            <button onClick={fetchMetrics} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="metrics-section">
      <div className="metrics-container">
        {/* <h2 className="metrics-title">
          <TrendingUp size={24} />
          Platform Metrics
        </h2> */}
        
        <div className="metrics-grid">
          <div className="metric-card">
            {/* <div className="metric-icon">
              <MessageSquare size={24} />
            </div> */}
            <div className="metric-content">
              <h3 className="metric-value">{formatNumber(metrics.totalPrompts)}</h3>
              <p className="metric-label">Total Prompts</p>
              <div className="metric-details">
                <span className="metric-period">Today: {formatNumber(metrics.promptsToday)}</span>
                <span className="metric-period">This Week: {formatNumber(metrics.promptsThisWeek)}</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            {/* <div className="metric-icon">
              <Activity size={24} />
            </div> */}
            <div className="metric-content">
              <h3 className="metric-value">{formatNumber(metrics.totalPayments)}</h3>
              <p className="metric-label">Total Payments</p>
              <div className="metric-details">
                <span className="metric-period">Processed</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            {/* <div className="metric-icon">
              <Users size={24} />
            </div> */}
            <div className="metric-content">
              <h3 className="metric-value">{formatNumber(metrics.totalWalletCreations)}</h3>
              <p className="metric-label">Wallets Created</p>
              <div className="metric-details">
                <span className="metric-period">Active Users</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            {/* <div className="metric-icon">
              <TrendingUp size={24} />
            </div> */}
            <div className="metric-content">
              <h3 className="metric-value">{formatNumber(metrics.totalFundings + metrics.totalTransfers)}</h3>
              <p className="metric-label">Transactions</p>
              <div className="metric-details">
                <span className="metric-period">Fundings: {formatNumber(metrics.totalFundings)}</span>
                <span className="metric-period">Transfers: {formatNumber(metrics.totalTransfers)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="metrics-footer">
          <p className="metrics-note">
            Real-time metrics from the OLE AI Agent platform
          </p>
          <button onClick={fetchMetrics} className="refresh-btn">
            <Activity size={16} />
            Refresh
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default MetricsDisplay; 