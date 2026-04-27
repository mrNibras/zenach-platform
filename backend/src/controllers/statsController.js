import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const buildMonthlySales = (orders) => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentYear = new Date().getFullYear();

  return labels.map((month, index) => {
    const sales = orders
      .filter((order) => {
        const created = new Date(order.createdAt);
        return created.getFullYear() === currentYear && created.getMonth() === index;
      })
      .reduce((sum, order) => sum + order.totalPrice, 0);

    return { month, sales };
  });
};

// @desc    Get admin dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [orders, totalProducts, totalCustomers] = await Promise.all([
      Order.find({}).sort({ createdAt: -1 }),
      Product.countDocuments({}),
      User.countDocuments({ role: 'user' }),
    ]);

    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const orderStatus = {
      pending: orders.filter((order) => order.status === 'pending').length,
      processing: orders.filter((order) => order.status === 'processing').length,
      shipped: orders.filter((order) => order.status === 'shipped').length,
      delivered: orders.filter((order) => order.status === 'delivered').length,
    };

    res.json({
      totalSales,
      totalOrders: orders.length,
      totalProducts,
      totalCustomers,
      orderStatus,
      monthlySales: buildMonthlySales(orders),
      recentOrders: orders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};