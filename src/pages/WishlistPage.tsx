import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: number[];
  description: string;
}

// Mock wishlist products
const mockWishlist: Product[] = [
  {
    _id: "1",
    name: "Zenach Air Max",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "men",
    sizes: [38, 39, 40, 41, 42],
    description: "Premium running shoes",
  },
  {
    _id: "2",
    name: "Zenach Pink Dream",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant pink sneakers",
  },
  {
    _id: "7",
    name: "Zenach Elegant Heels",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant heels for special occasions",
  },
];

export default function WishlistPage() {
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<Product[]>(mockWishlist);

  const handleAddToCart = (product: Product) => {
    addItem({
      _id: product._id + "-default",
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes[0] || 40,
      imageUrl: product.imageUrl,
    });
    alert(`${product.name} added to cart!`);
  };

  const handleRemove = (productId: string) => {
    setWishlist(wishlist.filter((p) => p._id !== productId));
  };

  const handleRemoveAll = () => {
    setWishlist([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
          <p className="text-gray-600">Save your favorite items for later</p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={handleRemoveAll}
            className="text-red-600 hover:text-red-700 flex items-center space-x-2"
          >
            <Trash2 className="h-5 w-5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">
            Save items you love by clicking the heart icon on product cards
          </p>
          <Link
            to="/products"
            className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Heart className="h-5 w-5 text-red-600 fill-red-600" />
                </button>
                <div className="absolute top-2 left-2">
                  <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-pink-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Add to Cart</span>
                  </button>
                  <Link
                    to={`/product/${product._id}`}
                    className="px-4 py-2 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
