import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Heart, ChevronLeft, Star } from "lucide-react";
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

// Mock product data with correct image URLs
const mockProducts: Record<string, Product> = {
  "1": {
    _id: "1",
    name: "Zenach Air Max",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41, 42],
    description:
      "Premium running shoes with advanced air cushioning technology. Designed for maximum comfort and performance during your runs. Features breathable mesh upper and durable rubber outsole.",
  },
  "2": {
    _id: "2",
    name: "Zenach Pink Dream",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=400&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description:
      "Elegant pink sneakers designed for everyday wear. Combines style with comfort for the modern woman. Perfect for casual outings and everyday activities.",
  },
  "3": {
    _id: "3",
    name: "Zenach Sport Pro",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43],
    description:
      "Professional sports shoes engineered for athletes. Superior grip, breathability, and support. Ideal for training sessions and competitive sports.",
  },
  "4": {
    _id: "4",
    name: "Zenach Casual Walk",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=400&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39],
    description:
      "Comfortable casual shoes perfect for daily wear. Lightweight and stylish design makes them ideal for walking, shopping, and everyday activities.",
  },
  "5": {
    _id: "5",
    name: "Zenach Kids Fun",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=600&h=400&fit=crop",
    category: "kids",
    sizes: [32, 33, 34, 35],
    description:
      "Fun and colorful shoes designed for active kids. Durable and comfortable with easy slip-on design. Perfect for school, play, and everyday wear.",
  },
  "6": {
    _id: "6",
    name: "Zenach Urban Elite",
    price: 109.99,
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&h=400&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41, 42],
    description:
      "Urban street style sneakers with modern design. Perfect for city life and casual outings. Features premium materials and comfortable fit.",
  },
  "7": {
    _id: "7",
    name: "Zenach Elegant Heels",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description:
      "Elegant heels for special occasions and formal events. Combines style with comfort for all-day wear. Perfect for weddings, parties, and business events.",
  },
  "8": {
    _id: "8",
    name: "Zenach Running Elite",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43, 44],
    description:
      "Elite running shoes for marathon runners and serious athletes. Advanced cushioning and support for long-distance running. Lightweight and durable.",
  },
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = id ? mockProducts[id] : null;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <Link to="/products" className="text-pink-600 mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addItem({
      _id: product._id + "-" + selectedSize,
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      imageUrl: product.imageUrl,
    });
    alert("Added to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          to="/products"
          className="text-pink-600 hover:text-pink-700 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-2xl shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm capitalize">
              {product.category}
            </span>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2 rounded-full ${
                isWishlisted ? "bg-pink-100" : "bg-gray-100"
              }`}
            >
              <Heart
                className={`h-6 w-6 ${
                  isWishlisted ? "text-pink-600 fill-pink-600" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="text-gray-600 ml-2">(4.5 out of 5)</span>
          </div>

          <p className="text-3xl font-bold text-pink-600 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Select Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-medium transition-colors ${
                    selectedSize === size
                      ? "border-pink-600 bg-pink-600 text-white"
                      : "border-gray-300 hover:border-pink-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-600"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-pink-600 text-white py-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2 text-lg font-medium"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>

          {/* Features */}
          <div className="mt-8 pt-8 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="bg-pink-100 rounded-full p-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-sm text-gray-600">Free Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-pink-100 rounded-full p-2">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
