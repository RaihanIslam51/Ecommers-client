'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './Components/ProductCard';
import ProductForm from './Components/ProductForm';
import ProductFilters from './Components/ProductFilters';
import ProductStats from './Components/ProductStats';
import ProductModal from './Components/ProductModal';

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life.',
    price: 89.99,
    originalPrice: 129.99,
    category: 'Electronics',
    brand: 'AudioTech',
    stock: 45,
    sku: 'ELEC-HEAD-001',
    image: '',
    images: [],
    tags: ['wireless', 'bluetooth', 'trending'],
    weight: '0.3',
    dimensions: '20 x 18 x 8 cm',
    warranty: '1 Year',
    returnPolicy: '30 days',
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    description: 'Advanced fitness tracking and heart rate monitor.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'TechWear',
    stock: 28,
    sku: 'ELEC-WATCH-002',
    image: '',
    images: [],
    tags: ['smartwatch', 'fitness', 'new'],
    weight: '0.05',
    dimensions: '4.5 x 4 x 1.2 cm',
    warranty: '2 Years',
    returnPolicy: '30 days',
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt.',
    price: 24.99,
    originalPrice: null,
    category: 'Clothing',
    brand: 'EcoWear',
    stock: 0,
    sku: 'CLOTH-SHIRT-003',
    image: '',
    images: [],
    tags: ['organic', 'sustainable', 'fashion'],
    weight: '0.2',
    dimensions: 'M, L, XL sizes',
    warranty: 'N/A',
    returnPolicy: '15 days',
  },
];

const ProductsPage = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    sortBy: '',
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.search) {
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(filters.search.toLowerCase()) || p.description.toLowerCase().includes(filters.search.toLowerCase()) || p.sku.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.stockStatus === 'inStock') {
      filtered = filtered.filter((p) => p.stock > 0);
    } else if (filters.stockStatus === 'outOfStock') {
      filtered = filtered.filter((p) => p.stock === 0);
    } else if (filters.stockStatus === 'lowStock') {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock < 10);
    }
    if (filters.sortBy) {
      const [field, order] = filters.sortBy.split('-');
      filtered.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        if (field === 'name') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (order === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
    return filtered;
  }, [filters, products]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', category: '', stockStatus: '', sortBy: '' });
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmitProduct = async (productData) => {
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...productData, id: p.id } : p));
    } else {
      const newProduct = { ...productData, id: Math.max(...products.map((p) => p.id), 0) + 1 };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen  p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
              <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            <button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>
        </div>

        <ProductStats products={products} />
        <ProductFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

        {showForm && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <ProductForm product={editingProduct} onSubmit={handleSubmitProduct} onCancel={handleCancelForm} />
              </div>
            </div>
          </div>
        )}

        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onView={handleViewProduct} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">{filters.search || filters.category || filters.stockStatus ? 'Try adjusting your filters' : 'Start by adding your first product'}</p>
            <button onClick={handleAddProduct} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Add Product</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
