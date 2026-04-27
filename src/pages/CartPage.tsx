import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-pink-50 rounded-2xl p-12">
          <ShoppingCart className="h-24 w-24 text-pink-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {items.map((item, index) => (
              <div
                key={item._id}
                className={`flex flex-col sm:flex-row items-center p-6 ${
                  index !== items.length - 1 ? "border-b" : ""
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-600">Size: {item.size}</p>
                  <p className="text-pink-600 font-bold mt-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/products"
              className="block text-center mt-4 text-pink-600 hover:text-pink-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
