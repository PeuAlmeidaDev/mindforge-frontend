import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useRouter } from 'next/router';
import { User, AuthContextType, RegisterUserData } from '../types/auth';
import { getUserProfile, loginUser, registerUser } from '../lib/authService';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
  isNewUser: false,
  token: null,
  setUser: () => {},
  refreshUserData: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  
  // Controle de tempo para atualizações
  const lastRefreshRef = useRef<number>(0);
  const updateThreshold = 5000; // 5 segundos entre atualizações

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        setToken(storedToken);
        const profile = await getUserProfile(storedToken);
        
        if (profile) {
          setUser(profile);
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setIsNewUser(false);
    
    const response = await loginUser(email, password);
    
    if (response.success && response.data) {
      const authToken = response.data.token;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(response.data.user);
      router.push('/dashboard');
    } else {
      setError(response.message || 'Falha no login. Verifique suas credenciais.');
    }
    
    setIsLoading(false);
  };

  const register = async (userData: RegisterUserData) => {
    setIsLoading(true);
    setError(null);
    
    const response = await registerUser(userData);
    
    if (response.success && response.data) {
      const authToken = response.data.token;
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(response.data.user);
      setIsNewUser(true);
      router.push('/dashboard');
    } else {
      setError(response.message || 'Falha no registro. Tente novamente.');
      throw new Error(response.message || 'Falha no registro');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsNewUser(false);
    router.push('/login');
  };

  const refreshUserData = async (force = false) => {
    if (!token) return;
    
    // Verificar se passou tempo suficiente desde a última atualização
    const now = Date.now();
    if (!force && now - lastRefreshRef.current < updateThreshold) {
      console.log('Atualização via Auth ignorada (muito frequente)');
      return;
    }
    
    // Atualizar timestamp
    lastRefreshRef.current = now;
    
    console.log('Atualizando dados do usuário via Auth API');
    
    try {
      const profile = await getUserProfile(token);
      if (profile) {
        setUser(profile);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
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
        error,
        isNewUser,
        token,
        setUser,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuthHook = () => useContext(AuthContext);

export { useAuthHook as useAuth };
export default useAuthHook; 