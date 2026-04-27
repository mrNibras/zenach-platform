import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { Filter, SlidersHorizontal } from "lucide-react";
import { productAPI } from "../services/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  sizes: number[];
  description: string;
}

// Mock products with correct image URLs
const mockProducts: Product[] = [
  {
    _id: "1",
    name: "Zenach Air Max",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41, 42],
    description: "Premium running shoes",
  },
  {
    _id: "2",
    name: "Zenach Pink Dream",
    price: 99.99,
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant pink sneakers",
  },
  {
    _id: "3",
    name: "Zenach Sport Pro",
    price: 149.99,
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43],
    description: "Professional sports shoes",
  },
  {
    _id: "4",
    name: "Zenach Casual Walk",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39],
    description: "Comfortable casual shoes",
  },
  {
    _id: "5",
    name: "Zenach Kids Fun",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1514989940723-e8875ea6ab7d?w=400&h=300&fit=crop",
    category: "kids",
    sizes: [32, 33, 34, 35],
    description: "Fun shoes for kids",
  },
  {
    _id: "6",
    name: "Zenach Urban Style",
    price: 109.99,
    imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop",
    category: "men",
    sizes: [38, 39, 40, 41],
    description: "Urban street style",
  },
  {
    _id: "7",
    name: "Zenach Elegant Heels",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39, 40],
    description: "Elegant heels",
  },
  {
    _id: "8",
    name: "Zenach Running Elite",
    price: 159.99,
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop",
    category: "men",
    sizes: [39, 40, 41, 42, 43, 44],
    description: "Elite running shoes",
  },
  {
    _id: "9",
    name: "Zenach Classic White",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop",
    category: "women",
    sizes: [36, 37, 38, 39],
    description: "Classic white sneakers",
  },
  {
    _id: "10",
    name: "Zenach Trail Master",
    price: 139.99,
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=300&fit=crop",
    category: "men",
    sizes: [40, 41, 42, 43],
    description: "Trail running shoes",
  },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const apiProducts = response.data.products || response.data;
        if (Array.isArray(apiProducts) && apiProducts.length > 0) {
          setProducts(apiProducts);
          setFilteredProducts(apiProducts);
        }
      } catch (error) {
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, sortBy, products]);

  const categories = [
    { value: "all", label: "All Products" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`md:w-64 ${showFilters ? "block" : "hidden md:block"}`}
        >
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500"
              >
                Close
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 text-pink-600"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange([0, 200]);
              }}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Toggle Filters */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {filteredProducts.length} products
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
