const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);

    // Drop problematic indexes that don't match our current schema
    const indexesToDrop = [
      'privyId_1_walletAddress_1',
      'frontendWalletAddress_1',
      'username_1'
    ];

    for (const indexName of indexesToDrop) {
      try {
        await usersCollection.dropIndex(indexName);
        console.log(`✅ Dropped index: ${indexName}`);
      } catch (error) {
        console.log(`ℹ️ Index ${indexName} not found or already dropped`);
      }
    }

    // List indexes again to confirm
    const updatedIndexes = await usersCollection.indexes();
    console.log('Updated indexes:', updatedIndexes);

    console.log('✅ Database fix completed');
  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixDatabase(); 