// Centralized Data Store using localStorage

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
  imageUrl: string;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentMethod: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  description: string;
  sizes: number[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Initialize default data
export const initializeData = () => {
  // Initialize products if not exists
  if (!localStorage.getItem("products")) {
    const defaultProducts: Product[] = [
      { 
        _id: "1", 
        name: "Zenach Air Max", 
        price: 129.99, 
        category: "men", 
        stock: 45, 
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop", 
        description: "Premium running shoes with air cushioning technology", 
        sizes: [38, 39, 40, 41, 42] 
      },
      { 
        _id: "2", 
        name: "Zenach Pink Dream", 
        price: 99.99, 
        category: "women", 
        stock: 32, 
        imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop", 
        description: "Elegant pink sneakers for everyday wear", 
        sizes: [36, 37, 38, 39, 40] 
      },
      { 
        _id: "3", 
        name: "Zenach Sport Pro", 
        price: 149.99, 
        category: "men", 
        stock: 28, 
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop", 
        description: "Professional sports shoes for athletes", 
        sizes: [39, 40, 41, 42, 43] 
      },
      { 
        _id: "4", 
        name: "Zenach Casual Walk", 
        price: 79.99, 
        category: "women", 
        stock: 56, 
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=400&fit=crop", 
        description: "Comfortable casual shoes for daily use", 
        sizes: [36, 37, 38, 39] 
      },
      { 
        _id: "5", 
        name: "Zenach Kids Fun", 
        price: 49.99, 
        category: "kids", 
        stock: 67, 
        imageUrl: "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=600&h=400&fit=crop", 
        description: "Fun and colorful shoes for kids", 
        sizes: [32, 33, 34, 35] 
      },
      { 
        _id: "6", 
        name: "Zenach Urban Elite", 
        price: 109.99, 
        category: "men", 
        stock: 40, 
        imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=400&fit=crop", 
        description: "Urban street style sneakers", 
        sizes: [38, 39, 40, 41, 42] 
      },
      { 
        _id: "7", 
        name: "Zenach Elegant Heels", 
        price: 119.99, 
        category: "women", 
        stock: 25, 
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop", 
        description: "Elegant heels for special occasions", 
        sizes: [36, 37, 38, 39, 40] 
      },
      { 
        _id: "8", 
        name: "Zenach Running Elite", 
        price: 159.99, 
        category: "men", 
        stock: 30, 
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop", 
        description: "Elite running shoes for marathon runners", 
        sizes: [39, 40, 41, 42, 43, 44] 
      },
      { 
        _id: "9", 
        name: "Zenach Classic White", 
        price: 89.99, 
        category: "women", 
        stock: 45, 
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=400&fit=crop", 
        description: "Classic white sneakers", 
        sizes: [36, 37, 38, 39, 40] 
      },
      { 
        _id: "10", 
        name: "Zenach Trail Master", 
        price: 139.99, 
        category: "men", 
        stock: 35, 
        imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=400&fit=crop", 
        description: "Trail running shoes for outdoor adventures", 
        sizes: [40, 41, 42, 43] 
      },
    ];
    localStorage.setItem("products", JSON.stringify(defaultProducts));
  }

  // Initialize orders if not exists
  if (!localStorage.getItem("orders")) {
    localStorage.setItem("orders", JSON.stringify([]));
  }

  // Initialize users if not exists
  if (!localStorage.getItem("users")) {
    const defaultUsers: User[] = [
      { id: "admin1", name: "System Admin", email: "admin@zenach.com", role: "admin" },
      { id: "user1", name: "John Doe", email: "user@zenach.com", role: "user" },
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};

// Products
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem("products") || "[]");
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem("products", JSON.stringify(products));
};

// Orders
export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem("orders") || "[]");
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const addOrder = (order: Order) => {
  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  saveOrders(orders);
  return order;
};

// Users
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem("users") || "[]");
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// Calculate Statistics
export const calculateStats = () => {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  // Total Sales (sum of all order totals)
  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  // Total Orders
  const totalOrders = orders.length;

  // Total Products
  const totalProducts = products.length;

  // Total Customers (unique users who placed orders + registered users)
  const uniqueCustomers = new Set(orders.map(o => o.userId));
  const totalCustomers = uniqueCustomers.size + users.filter(u => u.role === "user").length;

  // Order Status Breakdown
  const orderStatus = {
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  // Monthly Sales (last 6 months)
  const monthlySales = calculateMonthlySales(orders);

  return {
    totalSales,
    totalOrders,
    totalProducts,
    totalCustomers,
    orderStatus,
    monthlySales,
  };
};

const calculateMonthlySales = (orders: Order[]) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const salesData = months.map(month => ({ month, sales: 0 }));

  // Distribute orders across months (simulated for demo)
  orders.forEach((order, index) => {
    const monthIndex = index % 6;
    salesData[monthIndex].sales += order.totalPrice;
  });

  // Add some baseline sales for visualization
  const baseline = 18000;
  salesData.forEach((data, index) => {
    data.sales += baseline + (index * 1000) + data.sales;
  });

  return salesData;
};

// Generate unique order ID
export const generateOrderId = (): string => {
  const orders = getOrders();
  const nextId = orders.length + 1;
  return `ORD${String(nextId).padStart(3, "0")}`;
};
