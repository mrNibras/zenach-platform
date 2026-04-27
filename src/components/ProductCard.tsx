import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: number[];
  description: string;
}

interface ProductCardProps {
  product: Product;
}

// Reliable image component with fallback
function ReliableImage({ src, alt, className }: { 
  src: string; 
  alt: string; 
  className: string;
}) {
  const [error, setError] = useState(false);
  
  // Fallback gradient SVG
  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F8BBD0;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23EC407A;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EZenach Shoes%3C/text%3E%3C/svg%3E";

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      _id: product._id + "-default",
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.sizes[0] || 40,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <ReliableImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-pink-100 transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-2xl font-bold text-pink-600 mt-2">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-gray-500 text-sm ml-2">(4.5)</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
