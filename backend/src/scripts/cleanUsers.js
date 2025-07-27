const mongoose = require('mongoose');
require('dotenv').config();

async function cleanUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find users with old schema fields
    const oldUsers = await usersCollection.find({
      $or: [
        { privyId: { $exists: true } },
        { frontendWalletAddress: { $exists: true } },
        { username: { $exists: true } }
      ]
    }).toArray();

    console.log(`Found ${oldUsers.length} users with old schema fields`);

    if (oldUsers.length > 0) {
      // Update users to remove old fields and keep only the current schema
      for (const user of oldUsers) {
        const updateDoc = {
          $unset: {
            privyId: "",
            frontendWalletAddress: "",
            username: ""
          }
        };

        // Ensure required fields exist
        if (!user.walletAddress) {
          console.log(`⚠️ User ${user._id} has no walletAddress, skipping...`);
          continue;
        }

        await usersCollection.updateOne(
          { _id: user._id },
          updateDoc
        );
        console.log(`✅ Cleaned user: ${user.walletAddress}`);
      }
    }

    console.log('✅ User cleanup completed');
  } catch (error) {
    console.error('❌ Error cleaning users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanUsers(); 