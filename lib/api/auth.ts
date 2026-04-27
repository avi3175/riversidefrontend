import { api } from './axios';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<any> => {
    const response = await api.post('/auth/register', data);
    console.log('Register API raw response:', response.data);
    return response.data;
  },

  login: async (data: LoginData): Promise<any> => {
    const response = await api.post('/auth/login', data);
    console.log('Login API raw response:', response.data);
    return response.data;
  },
};