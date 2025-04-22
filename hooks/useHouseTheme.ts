import { useState, useEffect } from 'react';
import { 
  getThemeByHouseId, 
  getThemeByVisualTheme,
  getThemeByHouseName, 
  defaultTheme, 
  HouseTheme
} from '../lib/houseThemes';
import useAuth from './useAuth';

interface House {
  id: string;
  name: string;
  visualTheme?: string;
}

export function useHouseTheme() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<HouseTheme>(defaultTheme);

  useEffect(() => {
    if (user && user.house) {
      const house = user.house as House;
      
      // Primeira tentativa: usar o ID da casa diretamente
      const themeById = getThemeByHouseId(house.id);
      
      if (themeById !== defaultTheme) {
        setTheme(themeById);
      } 
      // Segunda tentativa: usar o visualTheme se disponível
      else if (house.visualTheme) {
        const themeByVisual = getThemeByVisualTheme(house.visualTheme);
        setTheme(themeByVisual);
      }
      // Terceira tentativa: usar o nome
      else {
        setTheme(getThemeByHouseName(house.name));
      }
    } else {
      // Caso contrário, usar tema padrão
      setTheme(defaultTheme);
    }
  }, [user]);

  // Função para alterar manualmente o tema ativo quando necessário
  const setActiveTheme = (houseName: string) => {
    setTheme(getThemeByHouseName(houseName));
  };

  return { theme, setActiveTheme };
}

export default useHouseTheme; 