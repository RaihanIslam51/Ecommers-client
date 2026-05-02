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
  const productsPerPage = 50;

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed Header Section */}
      <div className="shrink-0">
        {/* Breadcrumb */}
        {/* <div className="bg-white border-b border-gray-100">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
            <nav className="flex items-center space-x-2 text-xs text-gray-400 uppercase tracking-wide">
              <Link href="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link href="/store" className="hover:text-black transition-colors">Store</Link>
              {filters.categories && filters.categories.length > 0 && (
                <>
                  <span>/</span>
                  <span className="text-black font-medium">{filters.categories[0]}</span>
                </>
              )}
            </nav>
          </div>
        </div> */}

        {/* Search Bar */}
        {/* <div className="bg-white border-b border-gray-100">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative max-w-2xl mx-auto sm:mx-0">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 border border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-colors text-sm text-black placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-0.5"
                >
                  <FiX className="text-base" />
                </button>
              )}
            </div>
          </div>
        </div> */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-0 lg:gap-8">
        {/* Fixed Filter Sidebar - Desktop Only */}
        <div className="hidden lg:block lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-gray-100">
          <div className="p-6">
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

        {/* Products Section - Scrollable */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Fixed Toolbar */}
          <div className="shrink-0 bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-0">
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
            </div>
          </div>

          {/* Scrollable Products Grid/List */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {loading ? (
                  <StoreProductCardSkeletonGrid count={12} viewType={currentView} />
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12 sm:py-20 px-4">
                    <div className="text-5xl mb-4">—</div>
                    <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">
                      No Products Found
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                      Try adjusting your filters or search query
                    </p>
                    <button
                      onClick={handleClearAllFilters}
                      className="px-8 py-3 bg-black text-white text-sm font-semibold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`
                      ${currentView === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4'
                        : 'flex flex-col gap-3 sm:gap-4'
                      }
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
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-14 h-14 bg-black text-white shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center"
          aria-label="Open filters"
        >
          <BsFilterLeft className="text-xl" />
          {(filters.categories?.length > 0 || filters.priceRange || filters.customPriceRange || filters.productTypes?.length > 0 || filters.availability?.length > 0 || filters.ratings?.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-black border border-white text-white text-xs w-5 h-5 flex items-center justify-center font-bold">
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
  );
});

StorePageContent.displayName = 'StorePageContent';

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-sm text-gray-500 uppercase tracking-widest">Loading...</p>
      </div>
    </div>}>
      <StorePageContent />
    </Suspense>
  );
}