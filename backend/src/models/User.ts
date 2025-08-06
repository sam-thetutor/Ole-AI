import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  username?: string;
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
  username: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty username
        return /^[a-zA-Z0-9_-]{3,20}$/.test(v); // 3-20 chars, alphanumeric, underscore, hyphen
      },
      message: 'Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens'
    }
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

// Add unique index for username (only for non-null usernames)
UserSchema.index({ username: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { username: { $exists: true, $ne: null } }
});

export default mongoose.model<IUser>('User', UserSchema); 