import api from './api';
import { API_ENDPOINTS } from './config';
import { User, RegisterUserData } from '../types/auth';

interface AuthResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
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
    console.error('Erro detalhado no registro:', error.response?.data || error.message || error);
    
    // Extrair a mensagem de erro específica da API, se disponível
    let errorMessage = 'Erro ao registrar usuário';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 409) {
      errorMessage = 'Este email ou nome de usuário já está em uso';
    } else if (error.response?.status === 400) {
      errorMessage = 'Dados inválidos. Verifique as informações e tente novamente';
    }
    
    return {
      success: false,
      message: errorMessage,
      errors: error.response?.data?.errors
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