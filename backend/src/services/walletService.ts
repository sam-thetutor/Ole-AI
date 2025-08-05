import * as StellarSdk from '@stellar/stellar-sdk';
import Wallet from '../models/Wallet';
import WalletBalance from '../models/WalletBalance';
import crypto from 'crypto';
import { config } from '../config/environment';
import metricsService from './metricsService';

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
    this.server = new StellarSdk.Horizon.Server(config.stellarHorizonUrl);
    
    // Use a consistent encryption key across environments
    // This should be the same key used when wallets were originally created
    this.encryptionKey = config.walletEncryptionKey;
    
    if (!config.walletEncryptionKey || config.walletEncryptionKey === 'eeusdnisncienu') {
      console.warn('⚠️ WARNING: Using default wallet encryption key. Change WALLET_ENCRYPTION_KEY in production.');
    }
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

  // Get wallet by public key (wallet address)
  async getWalletByPublicKey(publicKey: string): Promise<IWallet | null> {
    try {
      return await Wallet.findOne({ 
        publicKey, 
        isActive: true 
      });
    } catch (error) {
      console.error('Error getting wallet by public key:', error);
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

  // Generate new Stellar wallet with USDC trustline and funding
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
      
      // Track wallet creation metric
      await metricsService.trackMetric('wallet_creation', userId, keypair.publicKey(), {
        network,
        timestamp: new Date().toISOString()
      });
      
      // Fund the wallet with XLM and establish USDC trustline
      await this.fundAndSetupWallet(keypair);
      
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

  // Fund wallet with XLM and establish USDC trustline
  private async fundAndSetupWallet(keypair: StellarSdk.Keypair): Promise<void> {
    try {
      console.log(`🚀 Setting up wallet: ${keypair.publicKey()}`);
      
      // Step 1: Fund with XLM using Friendbot
      await this.fundWalletWithXLM(keypair.publicKey());
      
      // Step 2: Establish USDC trustline
      await this.establishUSDCTrustline(keypair);
      
      // Step 3: Fund with USDC
      await this.fundWalletWithUSDC(keypair.publicKey());
      
      console.log(`✅ Wallet setup complete: ${keypair.publicKey()}`);
    } catch (error) {
      console.error('Error setting up wallet:', error);
      // Don't throw error - wallet creation should still succeed even if funding fails
    }
  }

  // Fund wallet with XLM from Friendbot
  private async fundWalletWithXLM(publicKey: string): Promise<void> {
    try {
      console.log(`💰 Funding wallet with XLM from Friendbot: ${publicKey}`);
      
      // Use Friendbot to fund the wallet with XLM
      await this.server.friendbot(publicKey).call();
      console.log(`✅ XLM funding successful via Friendbot`);
      
    } catch (error) {
      console.warn('⚠️ XLM funding error:', error);
      // Don't throw - wallet creation should still succeed
    }
  }

  // Establish USDC trustline
  private async establishUSDCTrustline(keypair: StellarSdk.Keypair): Promise<void> {
    try {
      console.log(`🔧 Establishing USDC trustline: ${keypair.publicKey()}`);
      
      const USDC_ASSET_ISSUER = 'GAHPYWLK6YRN7CVYZOO4H3VDRZ7PVF5UJGLZCSPAEIKJE2XSWF5LAGER';
      const USDC_ASSET_CODE = 'USDC';
      
      // Wait a moment for XLM funding to be processed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Load the account
      const account = await this.server.loadAccount(keypair.publicKey());
      
      // Create USDC asset
      const usdcAsset = new StellarSdk.Asset(USDC_ASSET_CODE, USDC_ASSET_ISSUER);
      
      // Create change trust operation
      const changeTrustOp = StellarSdk.Operation.changeTrust({
        asset: usdcAsset,
        limit: '922337203685.4775807', // Maximum limit
      });

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(changeTrustOp)
        .setTimeout(30)
        .build();

      // Sign transaction
      transaction.sign(keypair);
      
      // Submit transaction
      const result = await this.server.submitTransaction(transaction);
      console.log(`✅ USDC trustline established: ${result.hash}`);
      
    } catch (error: any) {
      console.warn('⚠️ USDC trustline establishment failed:', error.message);
      // Don't throw - wallet creation should still succeed
    }
  }

  // Fund wallet with USDC
  private async fundWalletWithUSDC(publicKey: string): Promise<void> {
    try {
      console.log(`💵 Funding wallet with USDC: ${publicKey}`);
      
      // Import and use the USDC funding service
      const { USDCFundingService, defaultFundingConfig } = await import('./usdcFundingService');
      const fundingService = new USDCFundingService(defaultFundingConfig);
      
      // Check if funding wallet is ready
      const fundingStatus = await fundingService.getFundingWalletStatus();
      if (!fundingStatus.exists || parseFloat(fundingStatus.usdcBalance) < 0.01) {
        console.log(`⚠️ USDC funding wallet not ready. Status:`, fundingStatus);
        console.log(`💡 Note: USDC funding requires manual intervention or a funding service`);
        return;
      }
      
      // Send USDC to the wallet
      const result = await fundingService.sendUSDCToWallet(publicKey, '0.1000000'); // Send 0.1 USDC
      if (result.success) {
        console.log(`✅ USDC funding successful: ${result.transactionHash}`);
      } else {
        console.log(`⚠️ USDC funding failed: ${result.error}`);
      }
      
    } catch (error) {
      console.warn('⚠️ USDC funding error:', error);
      // Don't throw - wallet creation should still succeed
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
  public decryptSecretKey(encryptedSecretKey: string): string {
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      
      const parts = encryptedSecretKey.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted secret key format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error: any) {
      console.error('Failed to decrypt secret key:', error);
      throw new Error(`Decryption failed: ${error.message}. This usually happens when the WALLET_ENCRYPTION_KEY environment variable has changed.`);
    }
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

  // Get transaction history from Stellar Horizon API
  async getTransactionHistory(publicKey: string): Promise<any[]> {
    try {
      console.log(`Fetching transaction history for wallet: ${publicKey}`);
      
      console.log(publicKey);
      // Use the Stellar SDK server to get transactions
      const transactions = await this.server.transactions()
      
        .forAccount(publicKey)
        .order('desc')
        .limit(20)
        .call();
      
      // Process and format transactions
      const formattedTransactions = await Promise.all(transactions.records.map(async (tx: any) => {
        // Get operations for this transaction to extract details
        const operations = await this.server.operations()
          .forTransaction(tx.hash)
          .call();
        
        // Extract operation details
        const firstOp = operations.records[0];
        let type = 'payment';
        let amount = '0.000000';
        let asset = 'XLM';
        let to = 'Unknown';
        
        if (firstOp) {
          type = firstOp.type;
          if (firstOp.type === 'payment') {
            amount = firstOp.amount || '0.000000';
            asset = firstOp.asset_type === 'native' ? 'XLM' : (firstOp.asset_code || 'XLM');
            to = firstOp.to || 'Unknown';
          }
        }
        
        return {
          id: tx.hash,
          type: type,
          amount: amount,
          asset: asset,
          from: tx.source_account,
          to: to,
          timestamp: tx.created_at,
          hash: tx.hash,
          memo: tx.memo,
          fee: tx.fee_paid,
          successful: tx.successful,
          ledger: tx.ledger,
          operation_count: tx.operation_count
        };
      }));
      
      return formattedTransactions;
    } catch (error: any) {
      console.error('Error fetching transaction history from Stellar Horizon:', error);
      
      // Return empty array on error
      return [];
    }
  }


}

export default new WalletService(); 




// stellar contract deploy \
//   --wasm target/wasm32v1-none/release/hello_world.wasm \
//   --source alice \
//   --network testnet \
//   --alias hello_world

//   stellar contract bindings typescript \
//   --network testnet \
//   --contract-id CAVPRBSNLSMZ3DW7MZUFK7RCZKHO3LQS2LTJ3WBVILIQGEO4S4K3GGCZ \
//   --output-dir packages/hello_world