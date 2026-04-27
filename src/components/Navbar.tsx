import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Heart, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-pink-600">Zenach</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/products?category=men"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Men
            </Link>
            <Link
              to="/products?category=women"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Women
            </Link>
            <Link
              to="/products?category=kids"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Kids
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 border border-pink-200 rounded-full focus:outline-none focus:border-pink-400"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Orders
                </Link>
                <span className="text-gray-700">
                  {user.name}
                  {user.role === "admin" && (
                    <span className="ml-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>
            )}
            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/products?category=men"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Men
              </Link>
              <Link
                to="/products?category=women"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Women
              </Link>
              <Link
                to="/products?category=kids"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Kids
              </Link>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-pink-200 rounded-full"
              />
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="bg-pink-100 text-pink-700 px-3 py-2 rounded-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      🛡️ Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-pink-600"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:text-pink-600 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-pink-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
              <Link
                to="/cart"
                className="text-gray-700 hover:text-pink-600"
                onClick={() => setIsOpen(false)}
              >
                Cart ({totalItems})
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
