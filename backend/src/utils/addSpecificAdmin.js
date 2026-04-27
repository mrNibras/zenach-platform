import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const addAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = "mrnibras33@gmail.com".trim().toLowerCase();
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    await User.create({
      name: "Mohammed Ahmed",
      email: email,
      password: "ramesh11",
      role: "admin"
    });

    console.log('✅ Success: Admin "Mohammed Ahmed" has been added to the database.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding admin:', error.message);
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    process.exit(1);
  }
};

addAdmin();