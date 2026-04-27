import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...\n');

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from your .env file. Please check the setup instructions.');
    }
    
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ Connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🏠 Host: ${mongoose.connection.host}`);
    console.log(`🔗 Port: ${mongoose.connection.port}`);
    
    // List collections
    const collections = await mongoose.connection.db.collections();
    console.log(`\n📚 Collections: ${collections.length}`);
    collections.forEach(collection => {
      console.log(`   - ${collection.collectionName}`);
    });

    console.log('\n✅ MongoDB is ready to use!');
    console.log('\n🌐 Browser Check URLs:');
    console.log(`   Health Check: http://localhost:5000/api/health`);
    console.log(`   Product Data: http://localhost:5000/api/products`);
    console.log(`   Atlas Console: https://cloud.mongodb.com/v2/clusters`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error(`Error: ${error.message}\n`);
    console.log('📋 Troubleshooting:');
    console.log('   1. Make sure MongoDB is running');
    console.log('   2. Check your MONGO_URI in .env file');
    console.log('   3. For Atlas: whitelist your IP address');
    console.log('   4. For local: run "mongod" command\n');
    process.exit(1);
  }
}

testConnection();
