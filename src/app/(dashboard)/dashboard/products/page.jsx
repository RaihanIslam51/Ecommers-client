'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './Components/ProductCard';
import ProductForm from './Components/ProductForm';
import ProductFilters from './Components/ProductFilters';
import ProductStats from './Components/ProductStats';
import ProductModal from './Components/ProductModal';
import { usePost, usePut, useDelete } from '@/hooks/useApi';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';



const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    sortBy: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Keep initial products if fetch fails
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch products from API on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${product.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Use _id for MongoDB documents, or id for local products
        const id = product._id || product.id;
        await axiosInstance.delete(`/products/${id}`);
        setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete product. Please try again.',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleSubmitProduct = async (productData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update existing product
        const id = editingProduct._id || editingProduct.id;
        const response = await axiosInstance.put(`/products/${id}`, productData);
        setProducts((prev) => prev.map((p) => {
          const currentId = p._id || p.id;
          const editId = editingProduct._id || editingProduct.id;
          return currentId === editId ? response.data : p;
        }));
        showAlert('Product updated successfully!', 'success');
      } else {
        // Create new product
        const response = await axiosInstance.post('/products', productData);
        setProducts((prev) => [...prev, response.data]);
        showAlert('Product added successfully!', 'success');
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product. Please try again.';
      showAlert(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen  p-4">
      {/* Alert Notification */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
              alert.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {alert.type === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        </div>
      )}

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
                <h2 className="text-2xl font-bold text-black mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <ProductForm 
                  product={editingProduct} 
                  onSubmit={handleSubmitProduct} 
                  onCancel={handleCancelForm}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onView={handleViewProduct} />
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
