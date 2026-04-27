import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Search, X } from "lucide-react";
import { getProducts, saveProducts, Product } from "../../utils/dataStore";
import { productAPI } from "../../services/api";

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "men",
    stock: "",
    imageUrl: "",
    description: "",
    sizes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load products on mount
  useEffect(() => {
    loadProducts();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadProducts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.products || response.data);
    } catch (error) {
      const loadedProducts = getProducts();
      setProducts(loadedProducts);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await productAPI.delete(id);
        await loadProducts();
      } catch (error) {
        const updatedProducts = products.filter((p) => p._id !== id);
        saveProducts(updatedProducts);
        setProducts(updatedProducts);
      }
      setSuccess("Product deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", price: "", category: "men", stock: "", imageUrl: "", description: "", sizes: "" });
    setShowAddModal(true);
    setError("");
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl,
      description: product.description,
      sizes: product.sizes.join(", "),
    });
    setShowEditModal(true);
    setError("");
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Please fill in all required fields");
      return;
    }

    const newProduct: Product = {
      _id: String(Date.now()),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
      description: formData.description || "New product",
      sizes: formData.sizes.split(",").map(s => parseInt(s.trim())).filter(s => !isNaN(s)),
    };

    try {
      await productAPI.create(newProduct);
      await loadProducts();
    } catch (error) {
      const updatedProducts = [...products, newProduct];
      saveProducts(updatedProducts);
      setProducts(updatedProducts);
    }
    setShowAddModal(false);
    setFormData({ name: "", price: "", category: "men", stock: "", imageUrl: "", description: "", sizes: "" });
    setSuccess("Product added successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleUpdateProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editingProduct) return;

    const updatedProducts = products.map(p => 
      p._id === editingProduct._id 
        ? {
            ...p,
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            stock: parseInt(formData.stock),
            imageUrl: formData.imageUrl || p.imageUrl,
            description: formData.description || p.description,
            sizes: formData.sizes.split(",").map(s => parseInt(s.trim())).filter(s => !isNaN(s)) || p.sizes,
          }
        : p
    );
    
    try {
      await productAPI.update(editingProduct._id, {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl || editingProduct.imageUrl,
        description: formData.description || editingProduct.description,
        sizes: formData.sizes.split(",").map(s => parseInt(s.trim())).filter(s => !isNaN(s)),
      });
      await loadProducts();
    } catch (error) {
      saveProducts(updatedProducts);
      setProducts(updatedProducts);
    }
    setShowEditModal(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", category: "men", stock: "", imageUrl: "", description: "", sizes: "" });
    setSuccess("Product updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="flex items-center px-6 py-3 bg-pink-600 text-white"
            >
              <Package className="h-5 w-5 mr-3" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Package className="h-5 w-5 mr-3" />
              Orders
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
              <p className="text-gray-600">Add, edit, and remove products from your store</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6">Product</th>
                  <th className="text-left py-4 px-6">Category</th>
                  <th className="text-left py-4 px-6">Price</th>
                  <th className="text-left py-4 px-6">Stock</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize">{product.category}</td>
                    <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={product.stock < 10 ? "text-red-600" : "text-green-600"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Add New Product</h2>
                  <button onClick={() => setShowAddModal(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Product description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="38, 39, 40, 41"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Edit Product</h2>
                  <button onClick={() => setShowEditModal(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="kids">Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sizes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.sizes}
                      onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={handleUpdateProduct}
                    className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                  >
                    Update Product
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
