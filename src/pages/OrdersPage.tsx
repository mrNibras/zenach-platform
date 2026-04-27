import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Package, CheckCircle, Clock, Truck } from "lucide-react";
import { getOrders, Order } from "../utils/dataStore";
import { useAuth } from "../contexts/AuthContext";
import { orderAPI } from "../services/api";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Processing" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
};

export default function OrdersPage() {
  const location = useLocation();
  const { user } = useAuth();
  const success = location.state?.success;
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderAPI.getAll();
        setOrders(response.data);
      } catch (error) {
        const allOrders = getOrders();
        if (user) {
          const userOrders = allOrders.filter(o => o.userId === user._id);
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      }
    };

    loadOrders();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          Order placed successfully! Your order has been confirmed.
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
          <p className="text-gray-600">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order._id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${
                        statusConfig[order.status].color
                      }`}
                    >
                      <StatusIcon className="h-4 w-4 mr-2" />
                      {statusConfig[order.status].label}
                    </span>
                    <p className="font-bold text-pink-600">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Size: {item.size} | Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Shipping to:</strong> {order.shippingAddress}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Payment:</strong> {order.paymentMethod}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button className="px-6 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors">
                      View Details
                    </button>
                    {order.status === "delivered" && (
                      <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                        Buy Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
