'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePackages } from '@/lib/hooks/usePackages';
import ItemCard from '@/components/items/ItemCard';
import SearchBar from '@/components/items/SearchBar';
import Filters, { FilterOptions } from '@/components/items/Filters';
import Pagination from '@/components/items/Pagination';
import { FaSpinner } from 'react-icons/fa';

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const {
    packages,
    loading,
    totalPages,
    currentPage,
    updateParams,
    goToPage,
  } = usePackages({
    page: 1,
    limit: 6,
  });

  // Apply filters whenever searchQuery or filters change
  useEffect(() => {
    const params: any = {
      page: 1,
      limit: 6,
    };
    
    // Add search if exists
    if (searchQuery && searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    
    // Add category if selected and not 'all'
    if (filters.category && filters.category !== 'all' && filters.category !== '') {
      params.category = filters.category;
    }
    
    // Add price filters
    if (filters.minPrice !== undefined && filters.minPrice !== null && filters.minPrice > 0) {
      params.minPrice = filters.minPrice;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null && filters.maxPrice > 0) {
      params.maxPrice = filters.maxPrice;
    }
    
    // Add sort
    if (filters.sort && filters.sort !== 'latest') {
      params.sort = filters.sort;
    }
    
    console.log('Applying filters with params:', params);
    console.log('Current filters object:', filters);
    updateParams(params);
  }, [searchQuery, filters, updateParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    console.log('Filter changed in parent:', newFilters);
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Riverside Packages
          </h1>
          <p className="text-xl text-gray-600">
            Discover the perfect getaway for your next adventure
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        {/* Filters and Results */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="md:w-1/4">
            <Filters onFilterChange={handleFilterChange} initialFilters={filters} />
          </div>

          {/* Packages Grid */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No packages found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search term.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-right text-gray-600">
                  Showing {packages.length} packages
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <ItemCard key={pkg.id} packageItem={pkg} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}