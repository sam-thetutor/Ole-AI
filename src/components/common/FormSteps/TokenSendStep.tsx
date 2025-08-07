import React, { useState, useEffect } from 'react';
import { Coins, User, AlertTriangle } from 'lucide-react';
import type { StepProps } from '../MultiStepForm';

// Step 1: Amount and Asset Selection
export const AmountStep: React.FC<StepProps> = ({ data, onUpdate, prefill }) => {
  const [amount, setAmount] = useState(data?.amount || prefill?.amount || '');
  const [asset, setAsset] = useState(data?.asset || prefill?.asset || 'XLM');

  const availableAssets = [
    { code: 'XLM', name: 'Stellar Lumens', icon: '⭐' },
    { code: 'USDC', name: 'USD Coin', icon: '💵' },
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' }
  ];

  useEffect(() => {
    onUpdate({ amount, asset });
  }, [amount, asset, onUpdate]);

  return (
    <div className="form-step">
      <div className="step-header">
        <Coins size={24} className="step-icon" />
        <h4>Amount & Asset</h4>
        <p>Enter the amount you want to send and select the asset</p>
      </div>

      <div className="form-fields">
        <div className="form-field">
          <label htmlFor="amount">Amount</label>
          <div className="input-group">
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.000001"
              min="0.000001"
              className="form-input"
            />
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="asset-select"
            >
              {availableAssets.map(assetOption => (
                <option key={assetOption.code} value={assetOption.code}>
                  {assetOption.icon} {assetOption.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="balance-info">
          <div className="balance-item">
            <span className="balance-label">Available Balance:</span>
            <span className="balance-value">1,234.56 XLM</span>
          </div>
          <div className="balance-item">
            <span className="balance-label">Network Fee:</span>
            <span className="balance-value">0.00001 XLM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Recipient Address
export const RecipientStep: React.FC<StepProps> = ({ data, onUpdate, prefill }) => {
  const [recipient, setRecipient] = useState(data?.recipient || prefill?.recipient || '');

  useEffect(() => {
    onUpdate({ recipient });
  }, [recipient, onUpdate]);

  return (
    <div className="form-step">
      <div className="step-header">
        <User size={24} className="step-icon" />
        <h4>Recipient Address</h4>
        <p>Enter the Stellar address of the recipient</p>
      </div>

      <div className="form-fields">
        <div className="form-field">
          <label htmlFor="recipient">Stellar Address</label>
          <div className="input-group">
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="GABC123..."
              className="form-input"
            />
            <button className="scan-btn" title="Scan QR Code">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {/* Validation removed for now */}
        </div>

        <div className="address-info">
          <div className="info-item">
            <span className="info-label">Address Type:</span>
            <span className="info-value">Stellar Public Key</span>
          </div>
          <div className="info-item">
            <span className="info-label">Network:</span>
            <span className="info-value">Stellar Mainnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Confirmation
export const ConfirmationStep: React.FC<StepProps> = ({ data, onUpdate }) => {
  const [memo, setMemo] = useState(data?.memo || '');

  useEffect(() => {
    onUpdate({ memo, isConfirmed: true });
  }, [memo, onUpdate]);

  const transactionData = {
    amount: data?.amount || '0',
    asset: data?.asset || 'XLM',
    recipient: data?.recipient || '',
    memo: memo,
    fee: '0.00001 XLM',
    total: `${parseFloat(data?.amount || '0') + 0.00001} XLM`
  };

  return (
    <div className="form-step">
      <div className="step-header">
        <AlertTriangle size={24} className="step-icon" />
        <h4>Confirm Transaction</h4>
        <p>Review the transaction details before sending</p>
      </div>

      <div className="confirmation-details">
        <div className="detail-row">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">{transactionData.amount} {transactionData.asset}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Recipient:</span>
          <span className="detail-value address">{transactionData.recipient}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Network Fee:</span>
          <span className="detail-value">{transactionData.fee}</span>
        </div>
        <div className="detail-row total">
          <span className="detail-label">Total:</span>
          <span className="detail-value">{transactionData.total}</span>
        </div>
      </div>

      <div className="form-fields">
        <div className="form-field">
          <label htmlFor="memo">Memo (Optional)</label>
          <input
            id="memo"
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Add a memo for this transaction"
            className="form-input"
            maxLength={28}
          />
          <div className="field-help">
            Memos help identify transactions. Max 28 characters.
          </div>
        </div>

        {/* Confirmation checkbox removed for now */}

        <div className="security-warning">
          <AlertTriangle size={16} />
          <div>
            <strong>Security Warning:</strong>
            <ul>
              <li>Double-check the recipient address</li>
              <li>Ensure you have sufficient balance</li>
              <li>This transaction cannot be reversed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 