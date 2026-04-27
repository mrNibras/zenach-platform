import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const verify = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = "mrnibras33@gmail.com".trim().toLowerCase();
    const user = await User.findOne({ email });

    if (user) {
      console.log('✅ Admin User Found:');
      console.log(`   Name:  ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role:  ${user.role}`);
      console.log(`   ID:    ${user._id}`);
    } else {
      console.log(`❌ No user found with email: ${email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verify();