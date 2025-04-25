import { API_ENDPOINTS } from './config';
import { User, RegisterUserData } from '../types/auth';

interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  message?: string;
}

export async function getUserProfile(token: string): Promise<User | null> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const { data } = await response.json();
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    return {
      success: response.ok && data.success,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Erro durante o login:', error);
    return {
      success: false,
      message: 'Erro ao conectar ao servidor. Tente novamente.'
    };
  }
}

export async function registerUser(userData: RegisterUserData): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    return {
      success: response.ok && data.success,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Erro durante o registro:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao conectar ao servidor. Tente novamente.'
    };
  }
} 