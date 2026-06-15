import { api } from './axios';

export interface Package {
  id: number;
  title: string;
  shortDesc: string;
  description: string;
  price: number;
  category: string;
  capacity: number;
  image: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackagesResponse {
  data: Package[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PackagesQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: 'latest' | 'oldest' | 'price_asc' | 'price_desc';
}

export const packagesAPI = {
  getAll: async (params?: PackagesQuery): Promise<PackagesResponse> => {
  const response = await api.get('/packages', { params });
  console.log('getAll raw response:', response.data);
  
  // Extract the data from the response
  if (response.data && response.data.data) {
    return {
      data: response.data.data,
      total: response.data.total || response.data.data.length,
      page: response.data.page || 1,
      limit: response.data.limit || 10,
      totalPages: response.data.totalPages || 1
    };
  }
  
  return response.data;
},

  


getFeatured: async (): Promise<Package[]> => {
  const response = await api.get('/packages/featured');
  console.log('getFeatured raw response:', response.data);
  
  // Extract the data from the response
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  return [];
},

 getById: async (id: string): Promise<Package> => {
  const response = await api.get(`/packages/${id}`);
  console.log('getById raw response:', response.data);
  
  // Extract the package data from the response
  if (response.data && response.data.data) {
    return response.data.data;
  }
  
  // Fallback in case the response is already the package
  return response.data;
},

  create: async (data: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<Package> => {
    const response = await api.post('/packages', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Package>): Promise<Package> => {
    const response = await api.patch(`/packages/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/packages/${id}`);
  },
};

