'use client';

import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import {
  CategoryCard,
  CategoryStats,
  CategoryFilters,
  AddCategoryModal,
  CategoryListView,
  DeleteConfirmModal
} from './Components';

const CategoriesPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample data - replace with your API data
  const [categories, setCategories] = useState([
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
    },
    {
      id: 4,
      name: 'Ready-to-Cook Meals',
      description: 'Pre-prepped meals that are ready to cook in minutes',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 15,
      status: 'active',
      color: '#ef4444'
    },
    {
      id: 5,
      name: 'Meal Kits',
      description: 'Complete meal kits with ingredients and recipes for easy cooking',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 12,
      status: 'active',
      color: '#8b5cf6'
    },
    {
      id: 6,
      name: 'Fresh Herbs & Spices',
      description: 'Aromatic herbs, spices, and seasonings for cooking',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 18,
      status: 'active',
      color: '#06b6d4'
    },
    {
      id: 7,
      name: 'Organic Products',
      description: 'Certified organic vegetables, fruits, and food items',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 22,
      status: 'active',
      color: '#16a34a'
    },
    {
      id: 8,
      name: 'Healthy Snacks',
      description: 'Nutritious snacks, nuts, seeds, and healthy alternatives',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 35,
      status: 'active',
      color: '#ea580c'
    },
    {
      id: 9,
      name: 'Dairy & Eggs',
      description: 'Fresh dairy products, eggs, and milk alternatives',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 14,
      status: 'inactive',
      color: '#64748b'
    },
    {
      id: 10,
      name: 'Beverages',
      description: 'Fresh juices, smoothies, and healthy drink options',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 8,
      status: 'active',
      color: '#3b82f6'
    },
    {
      id: 11,
      name: 'Grains & Cereals',
      description: 'Whole grains, rice, quinoa, and healthy cereals',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 16,
      status: 'active',
      color: '#a855f7'
    },
    {
      id: 12,
      name: 'Seasonal Specials',
      description: 'Limited-time seasonal vegetables, fruits, and special offers',
      image: 'https://i.ibb.co/b5NrY9ZS/image-Right.jpg',
      productCount: 9,
      status: 'active',
      color: '#ec4899'
    }
  ]);

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
  const handleAddCategory = (categoryData) => {
    const newCategory = {
      ...categoryData,
      id: categories.length + 1,
      productCount: 0
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleUpdateCategory = (updatedData) => {
    setCategories(categories.map(cat =>
      cat.id === selectedCategory.id ? { ...cat, ...updatedData } : cat
    ));
    setSelectedCategory(null);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id));
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const handleViewCategory = (category) => {
    console.log('View category:', category);
    // Implement view details functionality
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Categories Management
            </h1>
            <p className="text-gray-600">
              Organize and manage your product categories
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 font-semibold"
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

        {/* Categories Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={handleEditCategory}
                onDelete={handleDeleteClick}
                onView={handleViewCategory}
              />
            ))}
          </div>
        ) : (
          <CategoryListView
            categories={filteredCategories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteClick}
            onView={handleViewCategory}
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
    </div>
  );
};

export default CategoriesPage;
