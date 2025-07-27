import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletBalance extends Document {
  walletId: mongoose.Types.ObjectId;
  assetType: string;
  assetCode?: string;
  assetIssuer?: string;
  balance: string;
  limit?: string;
  buyingLiabilities?: string;
  sellingLiabilities?: string;
  isAuthorized?: boolean;
  isAuthorizedToMaintainLiabilities?: boolean;
  lastUpdated: Date;
}

const WalletBalanceSchema = new Schema<IWalletBalance>({
  walletId: {
    type: Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  assetType: {
    type: String,
    required: true,
    enum: ['native', 'credit_alphanum4', 'credit_alphanum12']
  },
  assetCode: {
    type: String,
    trim: true
  },
  assetIssuer: {
    type: String,
    trim: true
  },
  balance: {
    type: String,
    required: true
  },
  limit: {
    type: String
  },
  buyingLiabilities: {
    type: String
  },
  sellingLiabilities: {
    type: String
  },
  isAuthorized: {
    type: Boolean
  },
  isAuthorizedToMaintainLiabilities: {
    type: Boolean
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
WalletBalanceSchema.index({ walletId: 1, assetType: 1, assetCode: 1, assetIssuer: 1 });

export default mongoose.model<IWalletBalance>('WalletBalance', WalletBalanceSchema); 