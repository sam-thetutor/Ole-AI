import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  publicKey: string;
  secretKeyEncrypted: string;
  network: string;
  isPrimary: boolean;
  isActive: boolean;
  lastBalanceCheck: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  secretKeyEncrypted: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true,
    enum: ['testnet', 'public'],
    default: 'testnet'
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastBalanceCheck: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for balances (will be populated when wallet balance service is enabled)
WalletSchema.virtual('balances', {
  ref: 'WalletBalance',
  localField: '_id',
  foreignField: 'walletId'
});

export default mongoose.model<IWallet>('Wallet', WalletSchema); 