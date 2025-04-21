import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HouseTheme, getThemeByHouseName, defaultTheme } from '../lib/houseThemes';
import useAuth from './useAuth';

// Interface para o contexto do tema
interface HouseThemeContextType {
  theme: HouseTheme;
  setActiveTheme: (houseName: string) => void;
}

// Cria o contexto com valor padrão
const HouseThemeContext = createContext<HouseThemeContextType>({
  theme: defaultTheme,
  setActiveTheme: () => {},
});

// Props para o provider
interface HouseThemeProviderProps {
  children: ReactNode;
}

// Provider que disponibiliza o tema
export const HouseThemeProvider: React.FC<HouseThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<HouseTheme>(defaultTheme);

  // Atualiza o tema com base na casa do usuário quando ele é carregado
  useEffect(() => {
    if (user?.house?.name) {
      setTheme(getThemeByHouseName(user.house.name));
    } else {
      setTheme(defaultTheme);
    }
  }, [user]);

  // Função para alterar manualmente o tema ativo (se necessário)
  const setActiveTheme = (houseName: string) => {
    setTheme(getThemeByHouseName(houseName));
  };

  return (
    <HouseThemeContext.Provider value={{ theme, setActiveTheme }}>
      {children}
    </HouseThemeContext.Provider>
  );
};

// Hook personalizado para acessar o tema
export const useHouseTheme = () => {
  const context = useContext(HouseThemeContext);
  
  if (!context) {
    throw new Error('useHouseTheme deve ser usado dentro de um HouseThemeProvider');
  }
  
  return context;
};

export default useHouseTheme; 