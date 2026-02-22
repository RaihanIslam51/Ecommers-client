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
      // Server returns: { success: true, message: "...", products: [...] }
      const productsData = response.data.products || [];
      
      console.log('Fetched products:', productsData.length);
      if (productsData.length > 0) {
        console.log('First product sample:', productsData[0]);
        console.log('First product ID:', productsData[0]._id || productsData[0].id);
      }
      
      setProducts(productsData);
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
    console.log('Editing product:', product);
    console.log('Product ID:', product._id || product.id);
    
    // Validate product has an ID
    if (!product._id && !product.id) {
      console.error('Cannot edit product: No valid ID found', product);
      showAlert('Cannot edit product: Product ID is missing', 'error');
      return;
    }
    
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (product) => {
    // Debug: Log the product object to see its structure
    console.log('Product to delete:', product);
    console.log('Product._id:', product._id);
    console.log('Product.id:', product.id);
    
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
        
        if (!id) {
          console.error('No valid ID found for product:', product);
          throw new Error('Product ID is missing');
        }
        
        console.log('Deleting product with ID:', id);
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
        console.error('Error response:', error.response?.data);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || error.message || 'Failed to delete product. Please try again.',
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
        // Use productData._id first (from form), then fallback to editingProduct
        const id = productData._id || productData.id || editingProduct._id || editingProduct.id;
        
        // Validate ID exists
        if (!id) {
          console.error('Cannot update product: No valid ID found');
          console.error('productData:', productData);
          console.error('editingProduct:', editingProduct);
          throw new Error('Product ID is missing. Cannot update product.');
        }
        
        console.log('Updating product with ID:', id);
        const response = await axiosInstance.put(`/products/${id}`, productData);
        
        // Update the product in the list
        setProducts((prev) => prev.map((p) => {
          const currentId = p._id || p.id;
          return currentId === id ? (response.data.product || response.data) : p;
        }));
        
        showAlert('Product updated successfully!', 'success');
      } else {
        // Create new product
        console.log('Creating new product');
        const response = await axiosInstance.post('/products', productData);
        
        // Add the new product to the list
        const newProduct = response.data.product || response.data;
        setProducts((prev) => [...prev, newProduct]);
        
        showAlert('Product added successfully!', 'success');
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      const errorMessage = error.message || error.response?.data?.message || 'Failed to save product. Please try again.';
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
    <div className="min-h-screen bg-white text-black antialiased">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
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

      <div className="w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-black">Products Management</h1>
              <p className="text-gray-600 mt-1">Manage your product inventory</p>
            </div>
            <button onClick={handleAddProduct} className="px-6 py-3 border border-gray-200 bg-white text-black rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:bg-gray-50">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product._id || product.id || `product-${index}`} 
                product={product} 
                onEdit={handleEditProduct} 
                onDelete={handleDeleteProduct} 
                onView={handleViewProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-black mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">{filters.search || filters.category || filters.stockStatus ? 'Try adjusting your filters' : 'Start by adding your first product'}</p>
            <button onClick={handleAddProduct} className="px-6 py-2 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors">Add Product</button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProductsPage;
