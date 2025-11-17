'use client';
import React, { useState, useEffect, Suspense, memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiX } from 'react-icons/fi';
import { BsFilterLeft } from 'react-icons/bs';
import axiosInstance from '@/lib/axios';
import FilterSidebar from './Components/FilterSidebar';
import ProductToolbar from './Components/ProductToolbar';
import ActiveFilters from './Components/ActiveFilters';
import StoreProductCard from './Components/StoreProductCard';
import { StoreProductCardSkeletonGrid } from './Components/StoreProductCardSkeleton';
import Pagination from './Components/Pagination';

const StorePageContent = memo(() => {
  const searchParams = useSearchParams();
  const urlSearchQuery = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery || '');
  const [currentView, setCurrentView] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const productsPerPage = 12;

  const [filters, setFilters] = useState({
    categories: [],
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
  }, []);

  // Apply filters whenever filters, search, or sort changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, filters, searchQuery, sortBy]);

  const sortProducts = useCallback((productsArray) => {
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
  }, [sortBy]);

  const applyFilters = useCallback(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
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
  }, [products, filters, searchQuery, sortBy, sortProducts]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleRemoveFilter = useCallback((type, value) => {
    const newFilters = { ...filters };

    switch (type) {
      case 'category':
        newFilters.categories = newFilters.categories.filter(c => c !== value);
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
  }, [filters]);

  const handleClearAllFilters = useCallback(() => {
    setFilters({
      categories: [],
      priceRange: null,
      customPriceRange: null,
      productTypes: [],
      availability: [],
      ratings: []
    });
    setSearchQuery('');
  }, []);

  // Pagination
  const totalPages = useMemo(() => Math.ceil(filteredProducts.length / productsPerPage), [filteredProducts.length, productsPerPage]);
  const startIndex = useMemo(() => (currentPage - 1) * productsPerPage, [currentPage, productsPerPage]);
  const currentProducts = useMemo(() => 
    filteredProducts.slice(startIndex, startIndex + productsPerPage),
    [filteredProducts, startIndex, productsPerPage]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-3 sm:mb-4">
            {filters.categories && filters.categories.length > 0
              ? `${filters.categories[0]} Products`
              : 'Fresh Store'
            }
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            {filters.categories && filters.categories.length > 0
              ? `Browse our collection of fresh ${filters.categories[0].toLowerCase()} products with advanced filtering options.`
              : 'Discover our wide range of fresh vegetables, healthy meal kits, and ready-to-cook packages with advanced filtering options.'
            }
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/store" className="hover:text-green-600 transition-colors">
              Store
            </Link>
            {filters.categories && filters.categories.length > 0 && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-green-600 font-medium truncate">{filters.categories[0]}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="relative max-w-2xl mx-auto sm:mx-0">
            <FiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="text-lg sm:text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-64 lg:shrink-0">
            <div className="hidden lg:block">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                onClearAll={handleClearAllFilters}
                isMobileOpen={false}
              />
            </div>
          </div>

          {/* Mobile Filter Sidebar */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
                onClearAll={handleClearAllFilters}
                isMobileOpen={isMobileFilterOpen}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              currentView={currentView}
              onViewChange={setCurrentView}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
              filters={filters}
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
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`
                  ${currentView === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6'
                    : 'flex flex-col gap-3 sm:gap-4 lg:gap-6'
                  } p-4 sm:p-6
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

        {/* Mobile Floating Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            aria-label="Open filters"
          >
            <BsFilterLeft className="text-xl" />
            {/* Active filter indicator */}
            {(filters.categories?.length > 0 || filters.priceRange || filters.customPriceRange || filters.productTypes?.length > 0 || filters.availability?.length > 0 || filters.ratings?.length > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {[
                  filters.categories?.length || 0,
                  filters.priceRange ? 1 : 0,
                  filters.customPriceRange ? 1 : 0,
                  filters.productTypes?.length || 0,
                  filters.availability?.length || 0,
                  filters.ratings?.length || 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

StorePageContent.displayName = 'StorePageContent';

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading store...</p>
      </div>
    </div>}>
      <StorePageContent />
    </Suspense>
  );
}