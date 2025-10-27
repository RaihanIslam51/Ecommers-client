'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import axiosInstance from '@/lib/axios';
import FilterSidebar from './Components/FilterSidebar';
import ProductToolbar from './Components/ProductToolbar';
import ActiveFilters from './Components/ActiveFilters';
import StoreProductCard from './Components/StoreProductCard';
import { StoreProductCardSkeletonGrid } from './Components/StoreProductCardSkeleton';
import Pagination from './Components/Pagination';

const StorePage = () => {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || '');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: null,
    customPriceRange: null,
    productTypes: [],
    availability: [],
    ratings: []
  });

  // Update search query and category when URL changes
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
    if (urlCategory) {
      setFilters(prev => ({
        ...prev,
        categories: [urlCategory]
      }));
    }
  }, [urlSearchQuery, urlCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/products');
      // Server returns: { success: true, message: "...", products: [...] }
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      // Server returns: { success: true, message: "...", categories: [...] }
      if (response.data.success) {
        setCategories(response.data.categories || []);
        
        // Extract unique brands from products
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
        setBrands(uniqueBrands.length > 0 ? uniqueBrands : ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo']);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever filters, search, or sort changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filters, searchQuery, sortBy]);

  const applyFilters = () => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter(product =>
        filters.brands.includes(product.brand)
      );
    }

    // Price range filter (predefined)
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      result = result.filter(product => {
        const price = product.price || 0;
        return price >= min && (max === Infinity || price <= max);
      });
    }

    // Price range filter (custom)
    if (filters.customPriceRange?.min || filters.customPriceRange?.max) {
      const min = filters.customPriceRange.min || 0;
      const max = filters.customPriceRange.max || Infinity;
      result = result.filter(product => {
        const price = product.price || 0;
        return price >= min && price <= max;
      });
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      result = result.filter(product => {
        const stock = product.stock || 0;
        if (filters.availability.includes('In Stock') && stock > 0) return true;
        if (filters.availability.includes('Out of Stock') && stock === 0) return true;
        if (filters.availability.includes('Pre-Order') && product.preOrder) return true;
        return false;
      });
    }

    // Rating filter
    if (filters.ratings && filters.ratings.length > 0) {
      result = result.filter(product => {
        const rating = product.rating || 0;
        return filters.ratings.some(r => rating >= r);
      });
    }

    // Product Type filter
    if (filters.productTypes && filters.productTypes.length > 0) {
      result = result.filter(product => {
        if (filters.productTypes.includes('New Arrivals') && product.isNew) return true;
        if (filters.productTypes.includes('Best Sellers') && product.bestSeller) return true;
        if (filters.productTypes.includes('On Sale') && product.originalPrice > product.price) return true;
        if (filters.productTypes.includes('Featured') && product.featured) return true;
        return false;
      });
    }

    // Sorting
    result = sortProducts(result);

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const sortProducts = (productsArray) => {
    const sorted = [...productsArray];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high-low':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name-a-z':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-z-a':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRemoveFilter = (type, value) => {
    const newFilters = { ...filters };

    switch (type) {
      case 'category':
        newFilters.categories = newFilters.categories.filter(c => c !== value);
        break;
      case 'brand':
        newFilters.brands = newFilters.brands.filter(b => b !== value);
        break;
      case 'priceRange':
        newFilters.priceRange = null;
        break;
      case 'customPriceRange':
        newFilters.customPriceRange = null;
        break;
      case 'productType':
        newFilters.productTypes = newFilters.productTypes.filter(t => t !== value);
        break;
      case 'availability':
        newFilters.availability = newFilters.availability.filter(a => a !== value);
        break;
      case 'rating':
        newFilters.ratings = newFilters.ratings.filter(r => r !== value);
        break;
    }

    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: null,
      customPriceRange: null,
      productTypes: [],
      availability: [],
      ratings: []
    });
    setSearchQuery('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Store
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Discover our wide range of products with advanced filtering options to find exactly what you need.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="w-64 hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              brands={brands}
              onClearAll={handleClearAllFilters}
              isMobileOpen={false}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          {isMobileFilterOpen && (
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              brands={brands}
              onClearAll={handleClearAllFilters}
              isMobileOpen={isMobileFilterOpen}
              onCloseMobile={() => setIsMobileFilterOpen(false)}
            />
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              currentView={currentView}
              onViewChange={setCurrentView}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
            />

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Products Grid/List */}
            {loading ? (
              <StoreProductCardSkeletonGrid count={12} viewType={currentView} />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`
                  ${currentView === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-6'
                  } p-6
                `}>
                  {currentProducts.map((product) => (
                    <StoreProductCard
                      key={product._id || product.id}
                      product={product}
                      viewType={currentView}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePage;