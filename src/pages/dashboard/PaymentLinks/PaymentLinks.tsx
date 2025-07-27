import React, { useState, useEffect } from 'react';
import {Copy, ExternalLink, Plus, Loader2 } from 'lucide-react';
import apiService from '../../../services/api';
import './PaymentLinks.css';

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
}

const PaymentLinks: React.FC = () => {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentLinks();
  }, []);

  const fetchPaymentLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getUserPaymentLinks();
      
      if (response.success && response.data) {
        setPaymentLinks(response.data);
      } else {
        setError(response.message || 'Failed to load payment links');
      }
    } catch (err) {
      setError('Failed to load payment links');
      console.error('Error fetching payment links:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (linkId: string) => {
    const paymentUrl = `${window.location.origin}/pay/${linkId}`;
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className={`status-badge ${status}`}>
        {status === 'paid' ? 'Paid' : 'Pending'}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className={`type-badge ${type}`}>
        {type === 'fixed' ? 'Fixed' : 'Global'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="payment-links-container">
        <div className="payment-links-header">
          <h1 className="payment-links-title">Payment Links</h1>
          <p className="payment-links-subtitle">Manage your payment links</p>
        </div>
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={32} />
          <p>Loading payment links...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-links-container">
        <div className="payment-links-header">
          <h1 className="payment-links-title">Payment Links</h1>
          <p className="payment-links-subtitle">Manage your payment links</p>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={fetchPaymentLinks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-links-container">
      <div className="payment-links-header">
        <div className="header-content">
          <h1 className="payment-links-title">Payment Links</h1>
          <p className="payment-links-subtitle">Manage your payment links</p>
        </div>
        <div className="header-actions">
          <button className="create-link-btn">
            <Plus size={16} />
            Create New Link
          </button>
        </div>
      </div>

      {paymentLinks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <h3>No Payment Links Yet</h3>
          <p>Create your first payment link to start receiving payments</p>
          <button className="create-first-link-btn">
            <Plus size={16} />
            Create Payment Link
          </button>
        </div>
      ) : (
        <div className="payment-links-grid">
          {paymentLinks.map((link) => (
            <div key={link.linkId} className="payment-link-card">
              <div className="link-header">
                <div className="link-info">
                  <h3 className="link-title">
                    {link.title || `${link.type === 'fixed' ? 'Fixed' : 'Global'} Payment Link`}
                  </h3>
                  <div className="link-badges">
                    {getTypeBadge(link.type)}
                    {getStatusBadge(link.status)}
                  </div>
                </div>
                <div className="link-actions">
                  <button
                    className="action-btn copy-btn"
                    onClick={() => copyToClipboard(link.linkId)}
                    title="Copy payment link"
                  >
                    {copiedLink === link.linkId ? (
                      <span className="copied-text">Copied!</span>
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <a
                    href={`/pay/${link.linkId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn view-btn"
                    title="View payment page"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>

              <div className="link-details">
                {link.description && (
                  <p className="link-description">{link.description}</p>
                )}
                
                <div className="link-meta">
                  <div className="meta-item">
                    <span className="meta-label">Link ID:</span>
                    <span className="meta-value">{link.linkId}</span>
                  </div>
                  
                  {link.type === 'fixed' && link.amount && (
                    <div className="meta-item">
                      <span className="meta-label">Amount:</span>
                      <span className="meta-value amount">{link.amount} XLM</span>
                    </div>
                  )}
                  
                  {link.type === 'global' && (
                    <>
                      {link.totalContributions && (
                        <div className="meta-item">
                          <span className="meta-label">Total Received:</span>
                          <span className="meta-value">{link.totalContributions} XLM</span>
                        </div>
                      )}
                      {link.totalContributors && (
                        <div className="meta-item">
                          <span className="meta-label">Contributors:</span>
                          <span className="meta-value">{link.totalContributors}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="meta-item">
                    <span className="meta-label">Created:</span>
                    <span className="meta-value">{formatDate(link.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="link-footer">
                <a
                  href={`/pay/${link.linkId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link-btn"
                >
                  View Payment Page
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentLinks; 