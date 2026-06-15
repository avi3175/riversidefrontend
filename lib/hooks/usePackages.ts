'use client';

import { useState, useCallback } from 'react';
import { packagesAPI, Package, PackagesQuery } from '../api/packages';
import toast from 'react-hot-toast';

export function usePackages(initialParams?: PackagesQuery) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams?.page || 1);

  const fetchPackages = useCallback(async (params: PackagesQuery) => {
    setLoading(true);
    try {
      console.log('Fetching packages with params:', params);
      const response = await packagesAPI.getAll(params);
      console.log('API Response:', response);
      setPackages(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.page || 1);
    } catch (error: any) {
      console.error('Failed to fetch packages:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch packages');
      setPackages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParams = useCallback((newParams: Partial<PackagesQuery>) => {
    const params = { page: 1, limit: 6, ...newParams };
    console.log('updateParams called with:', params);
    fetchPackages(params);
  }, [fetchPackages]);

  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchPackages({ page, limit: 6 });
  }, [fetchPackages, totalPages]);

  return {
    packages,
    loading,
    totalPages,
    currentPage,
    updateParams,
    goToPage,
  };
}