import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: string;
  username: string;
  email: string;
  primaryElementalType: string;
  level: number;
  experience: number;
  house?: {
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
  userSkills?: Array<{
    skill: {
      id: string;
      name: string;
      description: string;
      elementalType: string;
      power: number;
      accuracy: number;
    };
    equipped: boolean;
  }>;
  interests?: Array<{
    id: string;
    name: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Interface para dados de registro
interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  primaryElementalType: string;
  interests: string[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Buscar o perfil do usuário
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const { data } = await response.json();
            setUser(data);
          } else {
            // Token inválido ou expirado
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          localStorage.removeItem('token');
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Salvar token e informações do usuário
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError('Erro ao conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterUserData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Se o registro for bem-sucedido, pode fazer login automático ou redirecionar
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Falha no registro. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro durante o registro:', error);
      setError(error instanceof Error ? error.message : 'Erro ao conectar ao servidor. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default useAuth; 