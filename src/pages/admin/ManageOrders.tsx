import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Search, Eye } from "lucide-react";
import { getOrders, saveOrders, Order } from "../../utils/dataStore";
import { orderAPI } from "../../services/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const statusOptions = ["pending", "processing", "shipped", "delivered"];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Load orders on mount
  useEffect(() => {
    loadOrders();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAllAdmin();
      setOrders(response.data);
    } catch (error) {
      const loadedOrders = getOrders();
      setOrders(loadedOrders);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderAPI.updateStatus(orderId, { status: newStatus });
      await loadOrders();
    } catch (error) {
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus as any } : order
      );
      saveOrders(updatedOrders);
      setOrders(updatedOrders);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Package className="h-5 w-5 mr-3" />
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
              className="flex items-center px-6 py-3 bg-pink-600 text-white"
            >
              <Package className="h-5 w-5 mr-3" />
              Orders
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
            <p className="text-gray-600">View and manage all customer orders</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="all">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6">Order ID</th>
                  <th className="text-left py-4 px-6">Customer</th>
                  <th className="text-left py-4 px-6">Items</th>
                  <th className="text-left py-4 px-6">Total</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Date</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{order._id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        {order.items.map((item, index) => (
                          <p key={index} className="text-sm">
                            {item.name} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusColors[order.status]
                        } border-0 cursor-pointer`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
