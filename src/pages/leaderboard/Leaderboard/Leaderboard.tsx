import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Calendar, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { useLeaderboard, useDataStoreHook } from '../../../hooks';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [leaderboardType, setLeaderboardType] = useState<'weekly' | 'monthly'>('weekly');
  
  // Use the data store hooks
  const { leaderboard, loading, error, fetchLeaderboard, isStale } = useLeaderboard();
  const { getUserRank, getUserScore, isAuthenticated, userProfile } = useDataStoreHook();

  // Fetch leaderboard data on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

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

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  const getCurrentLeaderboard = () => {
    if (!leaderboard) return [];
    return leaderboardType === 'weekly' ? leaderboard.weekly : leaderboard.monthly;
  };

  const currentLeaderboard = getCurrentLeaderboard();
  const userRank = getUserRank(leaderboardType);
  const userScore = getUserScore(leaderboardType);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <div className="leaderboard-title-section">
            <h1 className="leaderboard-title">
              <Trophy className="title-icon" size={32} />
              Leaderboard
            </h1>
          </div>
          
          <div className="leaderboard-controls">
            <div className="leaderboard-tabs">
              <button
                className={`leaderboard-tab ${leaderboardType === 'weekly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('weekly')}
                disabled={loading}
              >
                <Clock size={16} />
                <span>Weekly</span>
              </button>
              <button
                className={`leaderboard-tab ${leaderboardType === 'monthly' ? 'active' : ''}`}
                onClick={() => setLeaderboardType('monthly')}
                disabled={loading}
              >
                <Calendar size={16} />
                <span>Monthly</span>
              </button>
            </div>

            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* User's current position (if authenticated) */}
        {isAuthenticated() && userProfile && (
          <div className="user-position-card">
            <div className="user-position-header">
              <h3>Your Position</h3>
              <span className="position-type">{leaderboardType === 'weekly' ? 'Weekly' : 'Monthly'}</span>
            </div>
            <div className="user-position-content">
              <div className="user-rank">
                <span className="rank-label">Rank:</span>
                <span className="rank-value">
                  {userRank ? `#${userRank}` : 'Not ranked'}
                </span>
              </div>
              <div className="user-score">
                <span className="score-label">Score:</span>
                <span className="score-value">{userScore.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div className="error-content">
              <h3>Failed to load leaderboard</h3>
              <p>{error}</p>
              <button onClick={handleRefresh} className="retry-button">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p>Loading leaderboard...</p>
          </div>
        )}

        {/* Data Freshness Indicator */}
        {!loading && !error && isStale && (
          <div className="stale-data-warning">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span>Data may be outdated. Click refresh to get the latest.</span>
          </div>
        )}

        {/* Leaderboard Content */}
        {!loading && !error && currentLeaderboard.length > 0 && (
          <div className="leaderboard-content">
            <div className="leaderboard-table">
              <div className="leaderboard-header-row">
                <div className="leaderboard-cell rank-cell">Rank</div>
                <div className="leaderboard-cell user-cell">User</div>
                <div className="leaderboard-cell score-cell">Score</div>
                <div className="leaderboard-cell transactions-cell">Transactions</div>
                <div className="leaderboard-cell volume-cell">Volume</div>
                <div className="leaderboard-cell change-cell">Change</div>
              </div>

              {currentLeaderboard.map((entry) => (
                <div 
                  key={entry.id} 
                  className={`leaderboard-row ${
                    isAuthenticated() && userProfile?.walletAddress === entry.address 
                      ? 'current-user' 
                      : ''
                  }`}
                >
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
                  <div className="leaderboard-cell transactions-cell">
                    <span className="transactions">{entry.transactions}</span>
                  </div>
                  <div className="leaderboard-cell volume-cell">
                    <span className="volume">{entry.volume}</span>
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
        )}

        {/* Empty State */}
        {!loading && !error && currentLeaderboard.length === 0 && (
          <div className="empty-state">
            <Trophy className="w-12 h-12 text-gray-400" />
            <h3>No leaderboard data available</h3>
            <p>Check back later for updated rankings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 