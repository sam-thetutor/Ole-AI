import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  isActive: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for primary wallet (will be populated when wallet service is enabled)
UserSchema.virtual('primaryWallet', {
  ref: 'Wallet',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
  match: { isPrimary: true, isActive: true }
});

export default mongoose.model<IUser>('User', UserSchema); 