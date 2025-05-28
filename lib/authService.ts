import api from './api';
import { API_ENDPOINTS } from './config';
import { User, RegisterUserData } from '../types/auth';

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao fazer login'
    };
  }
};

export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao registrar usuário'
    };
  }
};

export const getUserProfile = async (token: string): Promise<User | null> => {
  try {
    const { data } = await api.get<AuthResponse>(API_ENDPOINTS.AUTH.PROFILE);
    return data.data?.user || null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}; 