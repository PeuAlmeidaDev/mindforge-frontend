import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

type User = {
  id: string;
  username: string;
  email: string;
  primaryElementalType: string;
  level: number;
  experience: number;
  house: {
    id: string;
    name: string;
  };
  attributes?: {
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
  };
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  primaryElementalType: string;
  interests: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário já está autenticado ao carregar a página
    const checkAuth = async () => {
      const token = localStorage.getItem('mindforge_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Token inválido');
        }
        
        // Se o token for válido, buscar dados do perfil
        const profileResponse = await fetch('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!profileResponse.ok) {
          throw new Error('Erro ao buscar perfil');
        }
        
        const profileData = await profileResponse.json();
        setUser(profileData.data);
      } catch (error) {
        console.error('Erro de autenticação:', error);
        localStorage.removeItem('mindforge_token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      localStorage.setItem('mindforge_token', data.data.token);
      setUser(data.data.user);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }
      
      localStorage.setItem('mindforge_token', data.data.token);
      setUser(data.data.user);
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mindforge_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth; 