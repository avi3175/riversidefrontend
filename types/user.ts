export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Helper function to safely convert API role string to UserRole
export const normalizeRole = (role: string): 'admin' | 'user' | 'manager' => {
  if (!role) return 'user';
  const lowerRole = role.toLowerCase();
  if (lowerRole === 'admin') return 'admin';
  if (lowerRole === 'manager') return 'manager';
  return 'user';
};