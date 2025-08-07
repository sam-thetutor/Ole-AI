const { Server, Networks } = require('@stellar/stellar-sdk');

// Configuration
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new Server(HORIZON_URL);

async function checkWalletBalance(walletAddress) {
  try {
    console.log(`🔍 Checking balance for wallet: ${walletAddress}`);
    
    const account = await server.loadAccount(walletAddress);
    
    console.log('\n📊 Account Details:');
    console.log(`Account ID: ${account.id}`);
    console.log(`Sequence Number: ${account.sequenceNumber()}`);
    
    console.log('\n💰 Balances:');
    account.balances.forEach((balance, index) => {
      const assetName = balance.asset_type === 'native' ? 'XLM' : balance.asset_code;
      console.log(`${index + 1}. ${assetName}: ${balance.balance}`);
      
      if (balance.asset_type !== 'native') {
        console.log(`   Issuer: ${balance.asset_issuer}`);
        console.log(`   Trustline Limit: ${balance.limit}`);
        console.log(`   Authorized: ${balance.is_authorized}`);
      }
    });
    
    // Check XLM balance specifically
    const xlmBalance = account.balances.find(b => b.asset_type === 'native');
    const xlmAmount = xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    
    console.log(`\n💡 XLM Balance: ${xlmAmount} XLM`);
    console.log(`💡 Minimum balance required: 1 XLM (for account to exist)`);
    console.log(`💡 Transaction fee: 0.00001 XLM`);
    
    if (xlmAmount < 1) {
      console.log(`⚠️  WARNING: Account has less than 1 XLM. This might cause issues.`);
    }
    
    return account.balances;
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`❌ Account not found: ${walletAddress}`);
      console.log(`💡 This account might not be activated on the Stellar network.`);
      console.log(`💡 You need at least 1 XLM to activate an account.`);
    } else {
      console.error('❌ Error checking balance:', error.message);
    }
    return null;
  }
}

async function testTransferCapability(fromAddress, toAddress, amount, asset = 'XLM') {
  try {
    console.log(`\n🔍 Testing transfer capability:`);
    console.log(`From: ${fromAddress}`);
    console.log(`To: ${toAddress}`);
    console.log(`Amount: ${amount} ${asset}`);
    
    // Check source account
    const sourceAccount = await server.loadAccount(fromAddress);
    const sourceBalance = sourceAccount.balances.find(b => 
      asset === 'XLM' ? b.asset_type === 'native' : 
      (b.asset_type === 'credit_alphanum4' && b.asset_code === asset)
    );
    
    const currentBalance = sourceBalance ? parseFloat(sourceBalance.balance) : 0;
    const transferAmount = parseFloat(amount);
    const fee = 0.00001; // Stellar transaction fee
    const totalRequired = asset === 'XLM' ? transferAmount + fee : transferAmount;
    
    console.log(`\n💰 Source Account Analysis:`);
    console.log(`Current ${asset} Balance: ${currentBalance}`);
    console.log(`Transfer Amount: ${transferAmount}`);
    console.log(`Transaction Fee: ${fee} XLM`);
    console.log(`Total Required: ${totalRequired} ${asset}`);
    
    if (asset === 'XLM' && currentBalance < totalRequired) {
      console.log(`❌ INSUFFICIENT BALANCE: ${currentBalance} < ${totalRequired}`);
      console.log(`💡 You need at least ${totalRequired} XLM to complete this transfer.`);
      return false;
    } else if (asset !== 'XLM' && currentBalance < transferAmount) {
      console.log(`❌ INSUFFICIENT ${asset} BALANCE: ${currentBalance} < ${transferAmount}`);
      return false;
    }
    
    // Check destination account (for USDC transfers)
    if (asset !== 'XLM') {
      try {
        const destAccount = await server.loadAccount(toAddress);
        const destBalance = destAccount.balances.find(b => 
          b.asset_type === 'credit_alphanum4' && b.asset_code === asset
        );
        
        if (!destBalance) {
          console.log(`❌ DESTINATION ACCOUNT MISSING TRUSTLINE: ${toAddress} doesn't have a ${asset} trustline`);
          console.log(`💡 The destination account needs to establish a trustline for ${asset} before receiving it.`);
          return false;
        }
      } catch (error) {
        console.log(`❌ DESTINATION ACCOUNT NOT FOUND: ${toAddress}`);
        console.log(`💡 The destination account might not be activated on the Stellar network.`);
        return false;
      }
    }
    
    console.log(`✅ TRANSFER CAPABILITY CHECK PASSED`);
    return true;
    
  } catch (error) {
    console.error('❌ Error testing transfer capability:', error.message);
    return false;
  }
}

// Example usage
async function main() {
  console.log('🚀 Stellar Wallet Debug Tool\n');
  
  // Replace with your wallet address
  const walletAddress = 'YOUR_WALLET_ADDRESS_HERE';
  
  if (walletAddress === 'YOUR_WALLET_ADDRESS_HERE') {
    console.log('⚠️  Please replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address');
    console.log('Usage: node debug-wallet.js');
    return;
  }
  
  // Check balance
  await checkWalletBalance(walletAddress);
  
  // Test transfer capability (example)
  const testAmount = '1';
  const testDestination = 'GABC1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  console.log('\n' + '='.repeat(50));
  await testTransferCapability(walletAddress, testDestination, testAmount, 'XLM');
}

// Run the debug tool
main().catch(console.error); 