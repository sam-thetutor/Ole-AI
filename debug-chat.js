const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

async function testChatMessage(walletAddress, message) {
  try {
    console.log(`🔍 Testing chat message: "${message}"`);
    console.log(`👤 Wallet: ${walletAddress}\n`);
    
    // First, connect the wallet to get an access token
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
    
    // Send chat message
    console.log('\n2. Sending chat message...');
    const chatResponse = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    const chatData = await chatResponse.json();
    
    if (chatData.success) {
      console.log('✅ Chat response received:');
      console.log(`📝 Response: ${chatData.response}`);
    } else {
      console.log('❌ Chat failed:', chatData.error || chatData.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing chat:', error.message);
  }
}

// Test different messages
async function runTests() {
  console.log('🚀 Chat Debug Tests\n');
  
  // Replace with your wallet address
  const walletAddress = 'YOUR_WALLET_ADDRESS_HERE';
  
  if (walletAddress === 'YOUR_WALLET_ADDRESS_HERE') {
    console.log('⚠️  Please replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address');
    console.log('Usage: node debug-chat.js');
    return;
  }
  
  const testMessages = [
    "What's my wallet balance?",
    "Check my balance",
    "Show me my XLM balance",
    "How much XLM do I have?",
    "What's my current balance?",
    "Get my wallet balance"
  ];
  
  for (const message of testMessages) {
    console.log('='.repeat(60));
    await testChatMessage(walletAddress, message);
    console.log('\n');
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

runTests().catch(console.error); 