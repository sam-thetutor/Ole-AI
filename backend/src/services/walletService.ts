import StellarSdk from '@stellar/stellar-sdk';
import Wallet from '../models/Wallet';
import WalletBalance from '../models/WalletBalance';
import crypto from 'crypto';

interface IWallet {
  _id: string;
  userId: string;
  publicKey: string;
  secretKeyEncrypted: string;
  network: string;
  isPrimary: boolean;
  isActive: boolean;
  lastBalanceCheck: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StellarBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
  limit?: string;
  buying_liabilities?: string;
  selling_liabilities?: string;
  is_authorized?: boolean;
  is_authorized_to_maintain_liabilities?: boolean;
}

class WalletService {
  private server: any;
  private encryptionKey: string;

  constructor() {
    const network = process.env.STELLAR_NETWORK || 'testnet';
    const horizonUrl = network === 'testnet' 
      ? 'https://horizon-testnet.stellar.org' 
      : 'https://horizon.stellar.org';
    
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
    this.encryptionKey = process.env.WALLET_ENCRYPTION_KEY || 'fallback-encryption-key';
  }

  // Get primary wallet by user ID
  async getPrimaryWalletByUserId(userId: string): Promise<IWallet | null> {
    try {
      return await Wallet.findOne({ 
        userId, 
        isPrimary: true, 
        isActive: true 
      });
    } catch (error) {
      console.error('Error getting primary wallet:', error);
      throw error;
    }
  }

  // Get wallet balances from Stellar network
  async getWalletBalanceFromStellar(publicKey: string): Promise<StellarBalance[]> {
    try {
      console.log(`Fetching balances for wallet: ${publicKey}`);
      
      // Get account details from Stellar
      const account = await this.server.loadAccount(publicKey);
      
      // Return balances
      return account.balances.map((balance: any) => ({
        asset_type: balance.asset_type,
        asset_code: balance.asset_code,
        asset_issuer: balance.asset_issuer,
        balance: balance.balance,
        limit: balance.limit,
        buying_liabilities: balance.buying_liabilities,
        selling_liabilities: balance.selling_liabilities,
        is_authorized: balance.is_authorized,
        is_authorized_to_maintain_liabilities: balance.is_authorized_to_maintain_liabilities
      }));
    } catch (error: any) {
      console.error('Error fetching Stellar balances:', error);
      
      // If account doesn't exist, return empty balances
      if (error.response?.status === 404) {
        console.log(`Account ${publicKey} not found on Stellar network`);
        return [];
      }
      
      throw error;
    }
  }

  // Generate new Stellar wallet
  async generateNewWallet(userId: string, network: string = 'testnet'): Promise<IWallet> {
    try {
      // Generate new keypair
      const keypair = StellarSdk.Keypair.random();
      
      // Encrypt the secret key
      const secretKeyEncrypted = this.encryptSecretKey(keypair.secret());
      
      // Create wallet in database
      const wallet = new Wallet({
        userId,
        publicKey: keypair.publicKey(),
        secretKeyEncrypted,
        network,
        isPrimary: true,
        isActive: true,
        lastBalanceCheck: new Date()
      });

      await wallet.save();
      console.log(`✅ Generated new wallet: ${keypair.publicKey()}`);
      
      return {
        _id: wallet._id?.toString() || '',
        userId: wallet.userId?.toString() || '',
        publicKey: wallet.publicKey,
        secretKeyEncrypted: wallet.secretKeyEncrypted,
        network: wallet.network,
        isPrimary: wallet.isPrimary,
        isActive: wallet.isActive,
        lastBalanceCheck: wallet.lastBalanceCheck,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
      } as IWallet;
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw error;
    }
  }

  // Encrypt secret key
  private encryptSecretKey(secretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(secretKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt secret key
  private decryptSecretKey(encryptedSecretKey: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
    
    const parts = encryptedSecretKey.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Update wallet balances in database
  async updateWalletBalances(walletId: string, balances: StellarBalance[]): Promise<void> {
    try {
      // Remove old balances
      await WalletBalance.deleteMany({ walletId });
      
      // Insert new balances
      const balanceDocs = balances.map(balance => ({
        walletId,
        assetType: balance.asset_type,
        assetCode: balance.asset_code,
        assetIssuer: balance.asset_issuer,
        balance: balance.balance,
        limit: balance.limit,
        buyingLiabilities: balance.buying_liabilities,
        sellingLiabilities: balance.selling_liabilities,
        isAuthorized: balance.is_authorized,
        isAuthorizedToMaintainLiabilities: balance.is_authorized_to_maintain_liabilities,
        lastUpdated: new Date()
      }));

      await WalletBalance.insertMany(balanceDocs);
      
      // Update wallet's last balance check
      await Wallet.findByIdAndUpdate(walletId, {
        lastBalanceCheck: new Date()
      });
      
      console.log(`✅ Updated balances for wallet: ${walletId}`);
    } catch (error) {
      console.error('Error updating wallet balances:', error);
      throw error;
    }
  }

  // Get wallet with cached balances
  async getWalletWithBalances(publicKey: string): Promise<any> {
    try {
      const wallet = await Wallet.findOne({ publicKey, isActive: true });
      if (!wallet) {
        return null;
      }

      const balances = await WalletBalance.find({ walletId: wallet._id });
      
      return {
        ...wallet.toObject(),
        balances: balances.map(balance => ({
          asset_type: balance.assetType,
          asset_code: balance.assetCode,
          asset_issuer: balance.assetIssuer,
          balance: balance.balance,
          limit: balance.limit,
          buying_liabilities: balance.buyingLiabilities,
          selling_liabilities: balance.sellingLiabilities,
          is_authorized: balance.isAuthorized,
          is_authorized_to_maintain_liabilities: balance.isAuthorizedToMaintainLiabilities
        }))
      };
    } catch (error) {
      console.error('Error getting wallet with balances:', error);
      throw error;
    }
  }
}

export default new WalletService(); 