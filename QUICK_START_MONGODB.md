# 🚀 Quick Start: MongoDB Setup

## ⚡ Fastest Way to Get Started

### **Option A: MongoDB Atlas (Cloud - Easiest)**

**5 minutes to running backend!**

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create free cluster** (M0 - Free forever)
3. **Create database user:**
   - Username: `zenachadmin`
   - Password: `zenach123` (or your own)
4. **Whitelist IP:** Choose "Allow Access from Anywhere"
5. **Get connection string** and copy it
6. **Update `backend/.env`:**
   ```env
   MONGO_URI=mongodb+srv://zenachadmin:zenach123@cluster0.xxxxx.mongodb.net/zenach
   ```

### **Option B: Local MongoDB**

**For offline development:**

**Windows:**
```bash
# Download & install from https://www.mongodb.com/try/download/community
# Then start MongoDB service
net start MongoDB
```

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

Then update `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/zenach
```

---

## 🎯 Next Steps (After MongoDB Setup)

### **1. Test Connection**
```bash
cd backend
npm run test-db
```

**Expected output:**
```
✅ Connected successfully!
📊 Database: zenach
✅ MongoDB is ready to use!
```

### **2. Seed Database**
```bash
npm run seed
```

**This creates:**
- 2 Users (Admin + Regular)
- 8 Shoe Products
- Ready-to-use database

### **3. Start Backend**
```bash
npm run dev
```

**Expected output:**
```
✅ MongoDB Connected: localhost
Server running in development mode on port 5000
```

### **4. Start Frontend** (New Terminal)
```bash
npm run dev
```

### **5. Test Login**
- URL: `http://localhost:5173`
- Email: `admin@zenach.com`
- Password: `admin123`

---

## 📋 Complete Setup Commands

```bash
# Terminal 1 - Backend
cd backend
npm run test-db      # Test MongoDB connection
npm run seed         # Seed database
npm run dev          # Start backend

# Terminal 2 - Frontend
npm run dev          # Start frontend
```

---

## ✅ Success Checklist

- [ ] MongoDB Atlas account created OR local MongoDB installed
- [ ] `.env` file configured with `MONGO_URI`
- [ ] `npm run test-db` shows "Connected successfully"
- [ ] `npm run seed` creates users and products
- [ ] Backend starts with "MongoDB Connected" message
- [ ] Frontend can login with demo accounts

---

## 🆘 Quick Troubleshooting

### **"MongoDB connection failed"**
```bash
# Start MongoDB
# Windows
net start MongoDB

# Mac
brew services start mongodb-community
```

### **"Authentication failed" (Atlas)**
- Check username/password in `.env`
- Make sure IP is whitelisted in Atlas

### **"Port 27017 already in use"**
```bash
# Stop existing MongoDB
# Windows
net stop MongoDB

# Mac
brew services stop mongodb-community
```

---

## 📞 Need Help?

**Full setup guide:** `backend/MONGODB_SETUP.md`

**Test connection:** `npm run test-db`

**Seed data:** `npm run seed`

**Start server:** `npm run dev`

---

**MongoDB is now set up and ready for your Zenach E-Commerce platform!** 🎉
