import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

dotenv.config();

// Sample data
const users = [
  {
    name: 'System Admin',
    email: 'admin@zenach.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'user@zenach.com',
    password: 'user123',
    role: 'user',
  },
];

const products = [
  {
    name: 'Zenach Air Max',
    brand: 'Zenach',
    price: 129.99,
    sizes: [38, 39, 40, 41, 42],
    category: 'men',
    description: 'Premium running shoes with advanced air cushioning technology. Designed for maximum comfort and performance during your runs.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
    stock: 45,
  },
  {
    name: 'Zenach Pink Dream',
    brand: 'Zenach',
    price: 99.99,
    sizes: [36, 37, 38, 39, 40],
    category: 'women',
    description: 'Elegant pink sneakers designed for everyday wear. Combines style with comfort for the modern woman.',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop',
    stock: 32,
  },
  {
    name: 'Zenach Sport Pro',
    brand: 'Zenach',
    price: 149.99,
    sizes: [39, 40, 41, 42, 43],
    category: 'men',
    description: 'Professional sports shoes engineered for athletes. Superior grip, breathability, and support.',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop',
    stock: 28,
  },
  {
    name: 'Zenach Casual Walk',
    brand: 'Zenach',
    price: 79.99,
    sizes: [36, 37, 38, 39],
    category: 'women',
    description: 'Comfortable casual shoes perfect for daily wear. Lightweight and stylish design.',
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=400&fit=crop',
    stock: 56,
  },
  {
    name: 'Zenach Kids Fun',
    brand: 'Zenach',
    price: 49.99,
    sizes: [32, 33, 34, 35],
    category: 'kids',
    description: 'Fun and colorful shoes designed for active kids. Durable and comfortable.',
    imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=600&h=400&fit=crop',
    stock: 67,
  },
  {
    name: 'Zenach Urban Elite',
    brand: 'Zenach',
    price: 109.99,
    sizes: [38, 39, 40, 41, 42],
    category: 'men',
    description: 'Urban street style sneakers with modern design. Perfect for city life.',
    imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=400&fit=crop',
    stock: 40,
  },
  {
    name: 'Zenach Elegant Heels',
    brand: 'Zenach',
    price: 119.99,
    sizes: [36, 37, 38, 39, 40],
    category: 'women',
    description: 'Elegant heels for special occasions and formal events. Combines style with comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop',
    stock: 25,
  },
  {
    name: 'Zenach Running Elite',
    brand: 'Zenach',
    price: 159.99,
    sizes: [39, 40, 41, 42, 43, 44],
    category: 'men',
    description: 'Elite running shoes for marathon runners and serious athletes.',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop',
    stock: 30,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('🔌 Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create users. Use create() so password hashing middleware runs.
    console.log('👤 Creating users...');
    const createdUsers = await Promise.all(users.map((user) => User.create(user)));
    console.log(`✅ ${createdUsers.length} users created`);

    // Create products
    console.log('👟 Creating products...');
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Created Data:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log('\n🔑 Demo Accounts:');
    console.log('   Admin: admin@zenach.com / admin123');
    console.log('   User: user@zenach.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
