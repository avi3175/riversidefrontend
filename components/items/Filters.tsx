'use client';

import { useState, useEffect } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface FiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

const categories = ['all', 'luxury', 'budget', 'family', 'romantic', 'adventure'];
const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Filters({ onFilterChange, initialFilters = {} }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: initialFilters.category || '',
    minPrice: initialFilters.minPrice,
    maxPrice: initialFilters.maxPrice,
    sort: initialFilters.sort || 'latest',
  });

  // Sync with initialFilters when they change from parent
  useEffect(() => {
    setFilters({
      category: initialFilters.category || '',
      minPrice: initialFilters.minPrice,
      maxPrice: initialFilters.maxPrice,
      sort: initialFilters.sort || 'latest',
    });
  }, [initialFilters]);

  const handleChange = (key: keyof FilterOptions, value: string | number) => {
    let parsedValue: string | number | undefined = value;
    
    // Handle price fields - convert to number or undefined
    if (key === 'minPrice' || key === 'maxPrice') {
      const numValue = Number(value);
      parsedValue = isNaN(numValue) || value === '' ? undefined : numValue;
    }
    
    // Handle category - convert 'all' to undefined
    if (key === 'category') {
      parsedValue = value === 'all' || value === '' ? undefined : value;
    }
    
    // Handle sort - ensure we have a value
    if (key === 'sort') {
      parsedValue = value === 'latest' ? 'latest' : value;
    }
    
    const newFilters = { ...filters, [key]: parsedValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterOptions = {
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'latest',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = !!(filters.category || filters.minPrice || filters.maxPrice);

  return (
    <div className="bg-[#06101a] rounded-lg shadow-md p-4 text-gray-300">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
      >
        <span className="flex items-center space-x-2">
          <FaFilter />
          <span>Filters</span>
        </span>
        {hasActiveFilters && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filter Content */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => {
              const newValue = e.target.value;
              console.log('Category changed to:', newValue);
              handleChange('category', newValue);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('Min price changed to:', newValue);
                handleChange('minPrice', newValue);
              }}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                console.log('Max price changed to:', newValue);
                handleChange('maxPrice', newValue);
              }}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort || 'latest'}
            onChange={(e) => {
              const newValue = e.target.value;
              console.log('Sort changed to:', newValue);
              handleChange('sort', newValue);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              console.log('Clearing all filters');
              clearFilters();
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
            <span className='text-white'>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}