import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ShoppingCart, DollarSign, TrendingUp, Users as UsersIcon, ArrowUpRight, Clock, Truck, CheckCircle, Shield, UserPlus, Pencil, Trash2 } from "lucide-react";
import AddAdminModal from "./AddAdminModal";
import { calculateStats, getOrders, Order } from "../../utils/dataStore";
import { authAPI, statsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [stats, setStats] = useState(calculateStats());
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeletingAdminId, setIsDeletingAdminId] = useState<string | null>(null);

  // Load data on mount and when storage changes
  useEffect(() => {
    loadData();
    
    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes every 2 seconds
    const interval = setInterval(loadData, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadData = async () => {
    try {
      const response = await statsAPI.getDashboard();
      const dashboardStats = response.data;
      setStats({
        totalSales: dashboardStats.totalSales,
        totalOrders: dashboardStats.totalOrders,
        totalProducts: dashboardStats.totalProducts,
        totalCustomers: dashboardStats.totalCustomers,
        orderStatus: dashboardStats.orderStatus,
        monthlySales: dashboardStats.monthlySales,
      });
      setRecentOrders(dashboardStats.recentOrders || []);
    } catch (error) {
      const newStats = calculateStats();
      setStats(newStats);

      const orders = getOrders();
      setRecentOrders(orders.slice(0, 5));
    }

    try {
      const adminResponse = await authAPI.getAdmins();
      setAdmins(adminResponse.data);
    } catch (error) {
      setAdmins([]);
    }
  };

  const handleAddAdmin = async (name: string, email: string, password: string) => {
    setErrorMessage("");
    await authAPI.createAdmin({ name, email, password });
    const adminResponse = await authAPI.getAdmins();
    setAdmins(adminResponse.data);
    setSuccessMessage("Admin added successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    setShowAddAdminModal(false);
  };

  const handleEditAdmin = async (name: string, email: string, password?: string) => {
    if (!editingAdmin) return;
    setErrorMessage("");

    const response = await authAPI.updateAdmin(editingAdmin._id, { name, email, password });
    const updatedAdmin = response.data;
    const adminResponse = await authAPI.getAdmins();
    setAdmins(adminResponse.data);

    if (user && user._id === updatedAdmin._id) {
      updateUser({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      });
    }

    setSuccessMessage("Admin updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    const isSelf = user?._id === admin._id;
    const confirmMessage = isSelf
      ? `Delete your admin account (${admin.email})? You will be logged out immediately.`
      : `Delete admin account for ${admin.email}? This cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsDeletingAdminId(admin._id);
      setErrorMessage("");
      const response = await authAPI.deleteAdmin(admin._id);

      if (isSelf) {
        logout();
        navigate("/login", { replace: true });
        return;
      }

      const adminResponse = await authAPI.getAdmins();
      setAdmins(adminResponse.data);
      setSuccessMessage(response.data.message || "Admin deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Unable to delete admin");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsDeletingAdminId(null);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
  };

  const maxSales = Math.max(...stats.monthlySales.map(d => d.sales), 1);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-pink-400">Zenach Admin</h1>
          </div>
          <nav className="mt-6">
            <Link
              to="/admin"
              className="flex items-center px-6 py-3 bg-pink-600 text-white"
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Package className="h-5 w-5 mr-3" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
              Orders
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Real-time analytics and overview</p>
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {errorMessage}
            </div>
          )}

          {/* Stats Cards - Auto-updating */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    ${stats.totalSales.toFixed(2)}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <p className="text-sm ml-1 text-green-600">
                      {stats.totalOrders} orders
                    </p>
                  </div>
                </div>
                <div className="bg-pink-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.totalOrders}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <p className="text-sm ml-1 text-green-600">Active</p>
                  </div>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.totalProducts}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <p className="text-sm ml-1 text-green-600">In catalog</p>
                  </div>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats.totalCustomers}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                    <p className="text-sm ml-1 text-green-600">Registered</p>
                  </div>
                </div>
                <div className="bg-purple-500 p-3 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Management Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-pink-600" />
                <h2 className="text-xl font-bold text-gray-800">Admin Accounts</h2>
              </div>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
              >
                <UserPlus className="h-5 w-5" />
                <span>Add Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600">Admin Name</th>
                    <th className="text-left py-3 px-4 text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 text-gray-600">Created Date</th>
                    <th className="text-left py-3 px-4 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{admin.name}</span>
                          {user?._id === admin._id && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">{admin.email}</td>
                      <td className="py-3 px-4">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingAdmin(admin)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin)}
                            disabled={admins.length <= 1 || isDeletingAdminId === admin._id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title={admins.length <= 1 ? "At least one admin account must remain" : "Delete admin"}
                          >
                            <Trash2 className="h-4 w-4" />
                            {isDeletingAdminId === admin._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart - Auto-updating */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Sales Overview</h2>
              <div className="space-y-4">
                {stats.monthlySales.map((data, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-12 text-gray-600 text-sm">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-pink-100 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-pink-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                          style={{ width: `${(data.sales / maxSales) * 100}%` }}
                        >
                          <span className="text-white text-xs font-medium">
                            ${(data.sales / 1000).toFixed(1)}k
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status - Auto-updating */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="text-xl font-bold text-yellow-600">
                    {stats.orderStatus.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">Processing</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {stats.orderStatus.processing}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium">Shipped</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">
                    {stats.orderStatus.shipped}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium">Delivered</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {stats.orderStatus.delivered}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders - Auto-updating */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-pink-600 hover:text-pink-700">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No orders yet. Place an order to see it here!
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{order._id}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Admin Modal */}
      <AddAdminModal
        isOpen={showAddAdminModal}
        onClose={() => setShowAddAdminModal(false)}
        onAddAdmin={handleAddAdmin}
      />

      <AddAdminModal
        isOpen={Boolean(editingAdmin)}
        onClose={() => setEditingAdmin(null)}
        onAddAdmin={handleAddAdmin}
        onEditAdmin={handleEditAdmin}
        initialValues={
          editingAdmin
            ? { name: editingAdmin.name, email: editingAdmin.email }
            : undefined
        }
        mode="edit"
      />
    </div>
  );
}
