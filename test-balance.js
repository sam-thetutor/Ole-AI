const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

async function testWalletBalance(walletAddress) {
  try {
    console.log('🔍 Testing wallet balance through backend API...\n');
    
    // First, try to connect the wallet to get an access token
    console.log('1. Connecting wallet...');
    const connectResponse = await fetch(`${API_BASE_URL}/auth/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });
    
    const connectData = await connectResponse.json();
    
    if (!connectData.success) {
      console.log('❌ Failed to connect wallet:', connectData.message);
      return;
    }
    
    console.log('✅ Wallet connected successfully');
    const accessToken = connectData.data.accessToken;
    
    // Get wallet details
    console.log('\n2. Getting wallet details...');
    const walletResponse = await fetch(`${API_BASE_URL}/wallet`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const walletData = await walletResponse.json();
    
    if (walletData.success) {
      console.log('✅ Wallet details retrieved:');
      console.log(`   Public Key: ${walletData.data.publicKey}`);
      console.log(`   Network: ${walletData.data.network}`);
      console.log(`   Created: ${walletData.data.createdAt}`);
      console.log(`   Last Balance Check: ${walletData.data.lastBalanceCheck}`);
      
      if (walletData.data.balances && walletData.data.balances.length > 0) {
        console.log('\n💰 Current Balances:');
        walletData.data.balances.forEach((balance, index) => {
          const assetName = balance.asset_type === 'native' ? 'XLM' : balance.asset_code;
          console.log(`   ${index + 1}. ${assetName}: ${balance.balance}`);
        });
      } else {
        console.log('\n⚠️  No balances found or account not activated');
      }
    } else {
      console.log('❌ Failed to get wallet details:', walletData.message);
    }
    
    // Refresh balances
    console.log('\n3. Refreshing balances from Stellar network...');
    const refreshResponse = await fetch(`${API_BASE_URL}/wallet/refresh-balances`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const refreshData = await refreshResponse.json();
    
    if (refreshData.success) {
      console.log('✅ Balances refreshed successfully');
      if (refreshData.data.balances && refreshData.data.balances.length > 0) {
        console.log('\n💰 Updated Balances:');
        refreshData.data.balances.forEach((balance, index) => {
          const assetName = balance.asset_type === 'native' ? 'XLM' : balance.asset_code;
          console.log(`   ${index + 1}. ${assetName}: ${balance.balance}`);
        });
      }
    } else {
      console.log('❌ Failed to refresh balances:', refreshData.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing wallet balance:', error.message);
  }
}

// Usage
async function main() {
  console.log('🚀 Backend Wallet Balance Test\n');
  
  // Replace with your wallet address
  const walletAddress = 'YOUR_WALLET_ADDRESS_HERE';
  
  if (walletAddress === 'YOUR_WALLET_ADDRESS_HERE') {
    console.log('⚠️  Please replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address');
    console.log('Usage: node test-balance.js');
    return;
  }
  
  await testWalletBalance(walletAddress);
}

main().catch(console.error); 