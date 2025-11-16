'use client';

import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';
import {
  InventoryCard,
  InventoryStats,
  InventoryFilters,
  RestockModal,
  InventoryListView,
  LowStockAlert,
  InventoryChartView
} from './Components';

const InventoryPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      sku: 'IP14PM-256-BLK',
      image: 'https://images.unsplash.com/photo-1678652197950-62d90f73fea8?w=400',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      category: 'Electronics',
      location: 'Warehouse A-12'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S23',
      sku: 'SGS23-128-WHT',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      category: 'Electronics',
      location: 'Warehouse A-13'
    }
  ]);

  const stats = {
    totalProducts: inventoryItems.length,
    lowStock: inventoryItems.filter(item => item.currentStock > 0 && item.currentStock <= item.minStock).length,
    outOfStock: inventoryItems.filter(item => item.currentStock === 0).length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.currentStock * 100), 0)
  };

  const lowStockItems = inventoryItems.filter(item => 
    item.currentStock > 0 && item.currentStock <= item.minStock
  );

  const getFilteredInventory = () => {
    let filtered = [...inventoryItems];
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredItems = getFilteredInventory();

  const handleRestock = (item) => {
    setSelectedItem(item);
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = (restockData) => {
    setInventoryItems(items =>
      items.map(item =>
        item.id === restockData.itemId
          ? { ...item, currentStock: restockData.newTotal }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="w-full mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600">Track and manage your product stock levels</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all hover:scale-105 font-semibold">
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        <InventoryStats stats={stats} />

        {lowStockItems.length > 0 && (
          <LowStockAlert items={lowStockItems} onRestock={handleRestock} />
        )}

        <InventoryFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onExport={() => console.log('Export')}
        />

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                onEdit={(i) => console.log('Edit', i)}
                onRestock={handleRestock}
                onView={(i) => console.log('View', i)}
              />
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <InventoryListView
            items={filteredItems}
            onEdit={(i) => console.log('Edit', i)}
            onRestock={handleRestock}
            onView={(i) => console.log('View', i)}
          />
        )}

        {viewMode === 'chart' && (
          <InventoryChartView items={filteredItems} />
        )}
      </div>

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleRestockSubmit}
        item={selectedItem}
      />
    </div>
  );
};

export default InventoryPage;
