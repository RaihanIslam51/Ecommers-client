'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Swal from 'sweetalert2';
import {
  CategoryCard,
  CategoryStats,
  CategoryFilters,
  AddCategoryModal,
  CategoryListView,
  DeleteConfirmModal,
  CategoryProductsModal
} from './Components';

const CategoriesPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);

  // Fetch categories from database
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/categories');
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      // show details only in development to avoid cluttering production console
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching categories:', error);
      }
      Swal.fire({
        icon: 'error',
        title: 'Failed to load categories',
        text: error.response?.data?.message || 'Please try again later',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setLoading(false);
    }
  };

  // OLD SAMPLE DATA - NOW FETCHING FROM DATABASE
  const oldCategories = [
    {
      id: 1,
      name: 'Fresh Vegetables',
      description: 'Fresh, organic vegetables including carrots, potatoes, tomatoes, and more',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 45,
      status: 'active',
      color: '#10b981'
    },
    {
      id: 2,
      name: 'Fresh Fruits',
      description: 'Seasonal fresh fruits, berries, and tropical fruits',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 32,
      status: 'active',
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Leafy Greens',
      description: 'Fresh leafy vegetables including spinach, lettuce, kale, and herbs',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 28,
      status: 'active',
      color: '#22c55e'
    }
   
  ];
  // End of old sample data

  // Calculate stats
  const stats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    inactive: categories.filter(c => c.status === 'inactive').length,
    totalProducts: categories.reduce((sum, c) => sum + (c.productCount || 0), 0)
  };

  // Filter and sort categories
  const getFilteredCategories = () => {
    let filtered = [...categories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(cat => cat.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'products':
          return (b.productCount || 0) - (a.productCount || 0);
        case 'products-asc':
          return (a.productCount || 0) - (b.productCount || 0);
        case 'recent':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredCategories = getFilteredCategories();

  // Handlers
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axiosInstance.post('/categories', categoryData);
      if (response.data.success) {
        await fetchCategories();
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'New category has been created successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to add category',
        text: error.response?.data?.message || 'Please try again',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleUpdateCategory = async (updatedData) => {
    try {
      const id = selectedCategory._id || selectedCategory.id;
      const response = await axiosInstance.put(`/categories/${id}`, updatedData);
      if (response.data.success) {
        await fetchCategories();
        setSelectedCategory(null);
        Swal.fire({
          icon: 'success',
          title: 'Category Updated!',
          text: 'Category has been updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update category',
        text: error.response?.data?.message || 'Please try again',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const id = selectedCategory._id || selectedCategory.id;
      await axiosInstance.delete(`/categories/${id}`);
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Category has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete category',
        text: error.response?.data?.message || 'Please try again',
        confirmButtonColor: '#3b82f6'
      });
      setIsDeleteModalOpen(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No categories selected',
        text: 'Please select categories to delete',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Selected Categories?',
      text: `Are you sure you want to delete ${selectedItems.length} categories? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await Promise.all(
          selectedItems.map(id => axiosInstance.delete(`/categories/${id}`))
        );
        await fetchCategories();
        setSelectedItems([]);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${selectedItems.length} categories have been deleted`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting categories:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete categories',
          text: 'Some categories could not be deleted',
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  };

  const handleSelectItem = (categoryId) => {
    setSelectedItems(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredCategories.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredCategories.map(cat => cat._id || cat.id));
    }
  };

  const handleViewCategory = (category) => {
    setViewingCategory(category);
    setIsProductsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl lg:text-5xl font-light text-black mb-2 tracking-tight">
              Categories Management
            </h1>
            <p className="text-gray-600 font-light">
              Organize and manage your product categories
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-gray-900 transition-all font-light"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Stats */}
        <CategoryStats stats={stats} />

        {/* Filters */}
        <CategoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredCategories.length}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                {selectedItems.length} selected
              </span>
            </div>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected
            </button>
          </div>
        )}

        {/* Categories Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading categories...</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category._id || category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteClick}
                onView={handleViewCategory}
                isSelected={selectedItems.includes(category._id || category.id)}
                onSelect={() => handleSelectItem(category._id || category.id)}
              />
            ))}
          </div>
        ) : (
          <CategoryListView
            categories={filteredCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteClick}
            onView={handleViewCategory}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
          />
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first category'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add First Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
        editData={selectedCategory}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        categoryName={selectedCategory?.name}
      />

      <CategoryProductsModal
        isOpen={isProductsModalOpen}
        onClose={() => {
          setIsProductsModalOpen(false);
          setViewingCategory(null);
        }}
        category={viewingCategory}
      />
    </div>
  );
};

export default CategoriesPage;
