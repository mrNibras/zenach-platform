import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, RotateCcw } from "lucide-react";
import ProductGrid from "../components/ProductGrid";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: number[];
  description: string;
}

// Mock products for demo
const mockProducts: Product[] = [
  {
    _id: "1",
    name: "Zenach Air Max",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41, 42],
    description: "Premium running shoes with air cushioning",
  },
  {
    _id: "2",
    name: "Zenach Pink Dream",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant pink sneakers for everyday wear",
  },
  {
    _id: "3",
    name: "Zenach Sport Pro",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43],
    description: "Professional sports shoes for athletes",
  },
  {
    _id: "4",
    name: "Zenach Casual Walk",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39],
    description: "Comfortable casual shoes for daily use",
  },
  {
    _id: "5",
    name: "Zenach Kids Fun",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=400&h=300&fit=crop",
    category: "kids",
    sizes: [32, 33, 34, 35],
    description: "Fun and colorful shoes for kids",
  },
  {
    _id: "6",
    name: "Zenach Urban Style",
    price: 109.99,
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41],
    description: "Urban street style sneakers",
  },
  {
    _id: "7",
    name: "Zenach Elegant Heels",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant heels for special occasions",
  },
  {
    _id: "8",
    name: "Zenach Running Elite",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Elite running shoes for marathon runners",
  },
];

// Hero image URL - SAME for both Option A and Option B
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

// Category images
const MEN_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=300&fit=crop";
const WOMEN_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop";
const KIDS_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=400&h=300&fit=crop";

// Reliable image component with fallback
function ReliableImage({ src, alt, className, fallbackColor = "pink" }: { 
  src: string; 
  alt: string; 
  className: string;
  fallbackColor?: string;
}) {
  const [error, setError] = useState(false);

  // Fallback SVG images as data URIs (always work)
  const fallbacks: Record<string, string> = {
    pink: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F8BBD0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23EC407A;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23grad1)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle'%3EZenach Shoes%3C/text%3E%3C/svg%3E",
    blue: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2390CAF9;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231976D2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad2)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='white' text-anchor='middle' dominant-baseline='middle'%3EMen's Collection%3C/text%3E%3C/svg%3E",
    green: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23A5D6A7;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23388E3C;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad3)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='32' fill='white' text-anchor='middle' dominant-baseline='middle'%3EKids' Collection%3C/text%3E%3C/svg%3E",
  };

  const fallbackSrc = fallbacks[fallbackColor] || fallbacks.pink;

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="eager"
      decoding="sync"
    />
  );
}

export default function HomePage() {
  const [featuredProducts] = useState<Product[]>(mockProducts.slice(0, 4));
  const [newArrivals] = useState<Product[]>(mockProducts.slice(4, 8));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-100 to-pink-200 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Step Into
                <span className="text-pink-600"> Style</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover our exclusive collection of premium shoes designed for
                comfort, style, and performance.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/products?category=women"
                  className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full hover:bg-pink-600 hover:text-white transition-colors"
                >
                  View Collection
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <ReliableImage
                src={HERO_IMAGE_URL}
                alt="Featured Shoes"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                fallbackColor="pink"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Best materials & craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category=men" className="group relative overflow-hidden rounded-xl">
              <ReliableImage
                src={MEN_CATEGORY_IMAGE}
                alt="Men's Shoes"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                fallbackColor="blue"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Men</h3>
              </div>
            </Link>
            <Link to="/products?category=women" className="group relative overflow-hidden rounded-xl">
              <ReliableImage
                src={WOMEN_CATEGORY_IMAGE}
                alt="Women's Shoes"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                fallbackColor="pink"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Women</h3>
              </div>
            </Link>
            <Link to="/products?category=kids" className="group relative overflow-hidden rounded-xl">
              <ReliableImage
                src={KIDS_CATEGORY_IMAGE}
                alt="Kids' Shoes"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                fallbackColor="green"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-bold">Kids</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-pink-600 hover:text-pink-700 flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/products"
              className="text-pink-600 hover:text-pink-700 flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-pink-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-pink-100 mb-8">
            Get the latest updates on new products and upcoming sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full w-full sm:w-96 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
