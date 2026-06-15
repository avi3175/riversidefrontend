'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';
import { User, AuthContextType, normalizeRole } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        const normalizedUser: User = {
          ...parsedUser,
          role: normalizeRole(parsedUser.role)
        };
        setUser(normalizedUser);
      } catch (error) {
        console.error('Failed to parse user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      console.log('Login response:', response); // Debug log
      
      // Handle different response structures
      let userData: any;
      let token: string;
      
      // Check various possible response formats
      if (response.user && response.token) {
        // Format: { user: {...}, token: "..." }
        userData = response.user;
        token = response.token;
      } else if (response.data && response.data.user && response.data.token) {
        // Format: { data: { user: {...}, token: "..." } }
        userData = response.data.user;
        token = response.data.token;
      } else if (response.user && !response.token) {
        // Maybe token is inside user or elsewhere
        userData = response.user;
        token = response.user.token || response.token;
      } else if (response.token && !response.user) {
        // Format: { token: "...", ...user fields directly in response }
        token = response.token;
        const { token: _, ...rest } = response;
        userData = rest;
      } else if (response.email || response.id) {
        // Maybe the response IS the user object with token separate
        userData = response;
        token = (response as any).token || localStorage.getItem('token');
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format from server');
      }
      
      // Ensure we have the required fields
      if (!userData || (!userData.id && !userData.email)) {
        console.error('Missing user data:', userData);
        throw new Error('Invalid user data received');
      }
      
      if (!token) {
        console.error('Missing token');
        throw new Error('No token received from server');
      }
      
      const normalizedUser: User = {
        id: userData.id || 0,
        name: userData.name || email.split('@')[0],
        email: userData.email,
        role: normalizeRole(userData.role || 'user')
      };
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: any) {
      console.error('Login error details:', error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });
      
      console.log('Register response:', response); // Debug log
      
      let userData: any;
      let token: string;
      
      // Handle different response structures
      if (response.user && response.token) {
        userData = response.user;
        token = response.token;
      } else if (response.data && response.data.user && response.data.token) {
        userData = response.data.user;
        token = response.data.token;
      } else if (response.token) {
        token = response.token;
        const { token: _, ...rest } = response;
        userData = rest;
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format from server');
      }
      
      if (!userData || !userData.email) {
        console.error('Missing user data:', userData);
        throw new Error('Invalid user data received');
      }
      
      if (!token) {
        console.error('Missing token');
        throw new Error('No token received from server');
      }
      
      const normalizedUser: User = {
        id: userData.id || 0,
        name: userData.name || name,
        email: userData.email,
        role: normalizeRole(userData.role || 'user')
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      setUser(normalizedUser);
      toast.success('Registered successfully!');
      router.push('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}