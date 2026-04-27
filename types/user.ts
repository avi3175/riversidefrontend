export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Helper function to safely convert API role string to UserRole
export const normalizeRole = (role: string): 'admin' | 'user' => {
  if (!role) return 'user';
  const lowerRole = role.toLowerCase();
  return lowerRole === 'admin' ? 'admin' : 'user';
};