# 🍃 MongoDB Setup Guide for Zenach Backend

## 📋 Prerequisites

Before setting up MongoDB, ensure you have:
- Node.js installed (v16 or higher)
- npm installed
- Basic command line knowledge

---

## 🚀 Option 1: MongoDB Atlas (Cloud - Recommended for Beginners)

### **Step 1: Create MongoDB Atlas Account**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (Free tier M0)

### **Step 2: Configure Cluster**

1. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `zenachadmin`
   - Password: (auto-generate or create your own)
   - Save credentials!

2. **Whitelist IP Address:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

3. **Get Connection String:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://zenachadmin:<password>@cluster0.xxxxx.mongodb.net/zenach?retryWrites=true&w=majority
   ```

### **Step 3: Update .env File**

Replace `<password>` with your actual password:
```env
MONGO_URI=mongodb+srv://zenachadmin:your_password_here@cluster0.xxxxx.mongodb.net/zenach?retryWrites=true&w=majority
```

---

## 🏠 Option 2: Local MongoDB (For Development)

### **Step 1: Install MongoDB**

#### **Windows:**
1. Download MongoDB Community Server:
   https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service

#### **macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### **Linux (Ubuntu/Debian):**
```bash
# Import public key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.gpg | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg

# Add repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

### **Step 2: Verify Installation**

```bash
mongod --version
# Should show MongoDB version
```

### **Step 3: Update .env File**

For local MongoDB, use:
```env
MONGO_URI=mongodb://localhost:27017/zenach
```

---

## ⚙️ Configuration

### **Update .env File**

Create or update `backend/.env`:

```env
# Environment
NODE_ENV=development

# Server
PORT=5000

# MongoDB (Choose ONE option below)

# Option 1: MongoDB Atlas (Cloud)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/zenach?retryWrites=true&w=majority

# Option 2: Local MongoDB
# MONGO_URI=mongodb://localhost:27017/zenach

# JWT Secret (Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
```

---

## 🌱 Seed the Database

After connecting to MongoDB, seed it with initial data:

```bash
cd backend
npm run seed
```

**This will create:**
- ✅ 2 Users (Admin + Regular User)
- ✅ 8 Products (Shoes)
- ✅ Empty Orders and Carts

**Demo Accounts:**
- **Admin:** `admin@zenach.com` / `admin123`
- **User:** `user@zenach.com` / `user123`

---

## 🚦 Start the Backend

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

**Server runs on:** `http://localhost:5000`

---

## ✅ Verify MongoDB Connection

### **Method 1: Check Server Logs**

When you start the backend, you should see:
```
✅ MongoDB Connected: localhost
📊 Database: zenach
Server running in development mode on port 5000
```

### **Method 2: Test API Endpoint**

```bash
curl http://localhost:5000/api/products
```

If successful, you'll get a JSON response with products.

### **Method 3: MongoDB Compass (GUI Tool)**

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using your connection string
3. Browse the `zenach` database
4. View collections: users, products, orders, carts

---

## 🔧 Troubleshooting

### **Error: "MongoDB connection failed"**

**Problem:** MongoDB not running  
**Solution:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### **Error: "Authentication failed" (Atlas)**

**Problem:** Wrong password or username  
**Solution:**
1. Check your `.env` file
2. Verify credentials in MongoDB Atlas
3. Make sure password doesn't contain special characters (or escape them)

### **Error: "Network timeout" (Atlas)**

**Problem:** IP not whitelisted  
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your IP or use 0.0.0.0/0 (allow all)
3. Wait 1-2 minutes for changes to apply

### **Error: "Port 27017 already in use"**

**Problem:** MongoDB already running  
**Solution:**
```bash
# Kill existing process
# Windows
net stop MongoDB

# Mac/Linux
sudo systemctl stop mongod
```

---

## 📊 MongoDB Collections

After seeding, your database will have these collections:

### **users**
```json
{
  "_id": "...",
  "name": "System Admin",
  "email": "admin@zenach.com",
  "password": "$2a$10$...", // Hashed
  "role": "admin",
  "createdAt": "2026-01-23T...",
  "updatedAt": "2026-01-23T..."
}
```

### **products**
```json
{
  "_id": "...",
  "name": "Zenach Air Max",
  "brand": "Zenach",
  "price": 129.99,
  "sizes": [38, 39, 40, 41, 42],
  "category": "men",
  "description": "...",
  "imageUrl": "https://...",
  "stock": 45,
  "createdAt": "2026-01-23T...",
  "updatedAt": "2026-01-23T..."
}
```

### **carts**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": "...",
      "quantity": 1,
      "selectedSize": 40
    }
  ],
  "createdAt": "2026-01-23T...",
  "updatedAt": "2026-01-23T..."
}
```

### **orders**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [...],
  "totalPrice": 129.99,
  "status": "pending",
  "shippingAddress": "...",
  "customerName": "...",
  "customerEmail": "...",
  "customerPhone": "...",
  "createdAt": "2026-01-23T...",
  "updatedAt": "2026-01-23T..."
}
```

---

## 🧪 Quick Test Commands

```bash
# Test connection
curl http://localhost:5000

# Get all products
curl http://localhost:5000/api/products

# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zenach.com","password":"admin123"}'
```

---

## 🎉 Success Checklist

- [ ] MongoDB installed or Atlas account created
- [ ] `.env` file configured with correct `MONGO_URI`
- [ ] Backend server started without errors
- [ ] "MongoDB Connected" message in console
- [ ] Database seeded with `npm run seed`
- [ ] API endpoints working (`/api/products` returns data)
- [ ] Can login with demo accounts

---

## 📚 Additional Resources

- **MongoDB Documentation:** https://docs.mongodb.com/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **MongoDB Compass:** https://www.mongodb.com/products/compass
- **Mongoose Documentation:** https://mongoosejs.com/

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify your `.env` file configuration
3. Ensure MongoDB is running
4. Check network/firewall settings (for Atlas)
5. Review this guide's troubleshooting section

---

**MongoDB is now ready for your Zenach E-Commerce platform!** 🚀
