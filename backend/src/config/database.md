# Zenach MongoDB Database

The backend uses MongoDB through Mongoose.

## Collections

- `users`: customer and admin accounts with bcrypt-hashed passwords.
- `products`: shoes managed by the admin dashboard.
- `carts`: authenticated user cart items.
- `orders`: checkout orders and order status history.

## Required Environment

Set `MONGO_URI` in `backend/.env`.

Local example:

```env
MONGO_URI=mongodb://localhost:27017/zenach
```

MongoDB Atlas example:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/zenach?retryWrites=true&w=majority
```

## Commands

```bash
cd backend
npm run test-db
npm run seed
npm run dev
```