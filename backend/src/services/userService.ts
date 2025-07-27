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
}

export default new UserService(); 