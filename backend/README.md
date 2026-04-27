# Zenach E-Commerce Backend API

A RESTful API for the Zenach Shoe E-Commerce Platform built with Node.js, Express, and MongoDB.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs for password hashing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT & role-based auth
│   │   └── errorMiddleware.js # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── index.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── app.js                 # Express app setup
│   └── server.js              # Entry point
├── .env                       # Environment variables
└── package.json
```

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the backend root:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/zenach
JWT_SECRET=your_jwt_secret_key_change_in_production
```

3. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication APIs

### Register User
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

### Login User
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

### Get User Profile
```http
GET /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

---

## 👟 Product APIs

### Get All Products
```http
GET /api/products?page=1&category=men&keyword=running
```
**Public**

### Get Single Product
```http
GET /api/products/:id
```
**Public**

### Create Product
```http
POST /api/products
```
**Protected (Admin only)**
**Request Body:**
```json
{
  "name": "Zenach Air Max",
  "price": 129.99,
  "sizes": [38, 39, 40, 41, 42],
  "category": "men",
  "description": "Premium running shoes",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 50
}
```

### Update Product
```http
PUT /api/products/:id
```
**Protected (Admin only)**

### Delete Product
```http
DELETE /api/products/:id
```
**Protected (Admin only)**

---

## 🛒 Cart APIs

### Get User Cart
```http
GET /api/cart
```
**Protected**

### Add to Cart
```http
POST /api/cart
```
**Protected**
**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 1,
  "selectedSize": 40
}
```

### Update Cart Item
```http
PUT /api/cart/:itemId
```
**Protected**

### Remove from Cart
```http
DELETE /api/cart/:itemId
```
**Protected**

### Clear Cart
```http
DELETE /api/cart
```
**Protected**

---

## 📦 Order APIs

### Create Order
```http
POST /api/orders
```
**Protected**
**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 1,
      "size": 40,
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "totalPrice": 99.99,
  "shippingAddress": "123 Main St, City, Country",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890",
  "paymentMethod": "Cash on Delivery"
}
```

### Get User Orders
```http
GET /api/orders
```
**Protected**

### Get Order by ID
```http
GET /api/orders/:id
```
**Protected**

### Update Order Status
```http
PUT /api/orders/:id/status
```
**Protected (Admin only)**
**Request Body:**
```json
{
  "status": "shipped"
}
```

### Get All Orders
```http
GET /api/orders/all
```
**Protected (Admin only)**

---

## 🔒 Security Features

- **Password Hashing:** bcryptjs (10 salt rounds)
- **JWT Authentication:** 30-day expiration
- **Role-Based Access:** User vs Admin roles
- **Input Validation:** express-validator
- **CORS Enabled:** Configured for frontend

---

## 📊 Database Models

### User
- name, email, password (hashed), role (user/admin)

### Product
- name, brand, price, sizes, category, description, imageUrl, stock

### Cart
- userId, items[] (productId, quantity, selectedSize)

### Order
- userId, items[], totalPrice, status, paymentMethod, shippingAddress, customer details

---

## 🧪 Testing

```bash
# Test API with curl or Postman
curl http://localhost:5000/api/products
```

---

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Update `MONGO_URI` to production MongoDB Atlas
3. Change `JWT_SECRET` to a strong random string
4. Deploy to Render, Railway, or Heroku

---

## 📝 License

MIT
