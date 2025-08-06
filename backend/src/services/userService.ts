import User, { IUser } from '../models/User';
import Wallet from '../models/Wallet';

class UserService {
  async createUser(walletAddress: string): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByWalletAddress(walletAddress);
      if (existingUser) {
        return existingUser;
      }

      // Create new user
      const user = new User({
        walletAddress,
        lastLoginAt: new Date()
      });

      await user.save();
      console.log(`✅ User created: ${walletAddress}`);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByWalletAddress(walletAddress: string): Promise<IUser | null> {
    try {
      return await User.findOne({ walletAddress });
    } catch (error) {
      console.error('Error getting user by wallet address:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async updateUserLastLogin(userId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { lastLoginAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating user last login:', error);
      throw error;
    }
  }

  async getUserWithPrimaryWallet(walletAddress: string): Promise<IUser | null> {
    try {
      return await User.findOne({ walletAddress })
        .populate({
          path: 'primaryWallet',
          match: { isPrimary: true, isActive: true }
        });
    } catch (error) {
      console.error('Error getting user with primary wallet:', error);
      throw error;
    }
  }

  async deactivateUser(userId: string): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  async setUsername(walletAddress: string, username: string): Promise<IUser | null> {
    try {
      // Check if username is already taken
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.walletAddress !== walletAddress) {
        throw new Error('Username is already taken');
      }

      // Update user with new username
      const user = await User.findOneAndUpdate(
        { walletAddress },
        { username },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`✅ Username set for ${walletAddress}: ${username}`);
      return user;
    } catch (error) {
      console.error('Error setting username:', error);
      throw error;
    }
  }

  async getUsername(walletAddress: string): Promise<string | null> {
    try {
      const user = await User.findOne({ walletAddress });
      return user?.username || null;
    } catch (error) {
      console.error('Error getting username:', error);
      throw error;
    }
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const existingUser = await User.findOne({ username });
      return !existingUser; // Return true if username is available
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  }
}

export default new UserService(); 