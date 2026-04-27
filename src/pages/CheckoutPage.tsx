import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Truck, Shield } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { addOrder, generateOrderId, Order, OrderItem } from "../utils/dataStore";
import { orderAPI } from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert("Please login to complete your order");
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    // Create order items
    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      imageUrl: item.imageUrl,
    }));

    // Create order
    const newOrder: Order = {
      _id: generateOrderId(),
      userId: user._id,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      items: orderItems,
      totalPrice: totalPrice,
      status: "pending",
      paymentMethod: "Cash on Delivery",
      createdAt: new Date().toISOString(),
    };

    try {
      await orderAPI.create({
        items: orderItems,
        totalPrice,
        shippingAddress: newOrder.shippingAddress,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        paymentMethod: newOrder.paymentMethod,
      });
    } catch (apiError) {
      // Keep checkout usable when the backend is offline.
      addOrder(newOrder);
    }

    // Simulate processing delay
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      navigate("/orders", { state: { success: true } });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <Truck className="h-6 w-6 text-pink-600 mr-2" />
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method - Manual */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-pink-600 mr-2" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                <h3 className="font-semibold text-pink-800 mb-3">Cash on Delivery</h3>
                <p className="text-pink-700 text-sm">
                  Pay when you receive your order. Cash or card payment accepted upon delivery.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-pink-600 text-white py-4 rounded-lg hover:bg-pink-700 transition-colors font-medium text-lg disabled:bg-pink-400"
            >
              {isProcessing ? "Processing..." : `Place Order - $${totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex items-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} x ${item.price}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-pink-600 mr-2" />
                <span className="text-sm text-gray-700">
                  Secure Order - Payment on Delivery
                </span>
              </div>
            </div>

            <Link to="/cart" className="block text-center mt-4 text-pink-600 hover:text-pink-700">
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
