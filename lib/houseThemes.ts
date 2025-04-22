// Define a interface para o tema de cada casa
export interface HouseTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundDark: string;
    text: string;
    accent: string;
    tertiary: string;
  };
  bannerImage: string;
  flagImage: string;
  visualTheme: string;
}

// Definição de identificadores das casas
export const HOUSE_IDS = {
  FLOR_ESPIRITO_DOURADO: 'c9bed66d-22d9-434d-8054-f32279a0c892',
  ORDEM_TRES_FACES: '7d7e4640-dbb8-4706-b9c6-7bebc4db9586',
  ALMA_AGUAS_FLAMEJANTES: '72b77187-306f-4b57-8cfc-5c7815e598ca',
  CHAMAS_RUGIDO: 'b12b997b-6d56-41d4-88ab-616f9cee7c85',
  KAZOKU_OKAMI: '32d6b1a9-8c42-4bfa-a7d8-2d4453034cb7',
};

// Mapeamento de temas visuais para IDs de casa
export const VISUAL_THEMES = {
  'gold-white': HOUSE_IDS.FLOR_ESPIRITO_DOURADO,
  'earth-green': HOUSE_IDS.ORDEM_TRES_FACES,
  'dark-red': HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES,
  'cyber-purple': HOUSE_IDS.CHAMAS_RUGIDO,
  'light-blue': HOUSE_IDS.KAZOKU_OKAMI,
};

// Define os temas para cada casa
export const houseThemes: Record<string, HouseTheme> = {
  [HOUSE_IDS.FLOR_ESPIRITO_DOURADO]: {
    id: HOUSE_IDS.FLOR_ESPIRITO_DOURADO,
    name: 'Flor do Espírito Dourado',
    visualTheme: 'gold-white',
    colors: {
      primary: '#FFD700', // Dourado
      secondary: '#FFFFFF', // Branco
      background: '#121212', // Preto
      backgroundDark: '#050505', // Preto mais escuro
      text: '#FFFFFF', // Branco
      accent: '#E6C200', // Dourado mais escuro
      tertiary: '#E6C200', // Dourado mais escuro (mesmo que accent por padrão)
    },
    bannerImage: '/images/Casas/FlorDoEspiritoDourado/banner.jpg',
    flagImage: '/images/Casas/FlorDoEspiritoDourado/bandeira.jpg',
  },
  [HOUSE_IDS.ORDEM_TRES_FACES]: {
    id: HOUSE_IDS.ORDEM_TRES_FACES,
    name: 'Ordem das Três Faces',
    visualTheme: 'cyber-purple',
    colors: {
      primary: '#6C63FF', // Roxo cibernético
      secondary: '#A89CFF', // Roxo cibernético claro
      background: '#0D0D1F', // Background cósmico escuro
      backgroundDark: '#07071A', // Cósmico mais intenso
      text: '#FFFFFF', // Branco
      accent: '#8D85FF', // Roxo médio
      tertiary: '#6C63FF', // Roxo cibernético
    },
    bannerImage: '/images/Casas/OrdemDasTresFaces/banner.jpg',
    flagImage: '/images/Casas/OrdemDasTresFaces/bandeira.jpg',
  },
  [HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES]: {
    id: HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES,
    name: 'Alma das Águas Flamejantes',
    visualTheme: 'dark-red',
    colors: {
      primary: '#B71C1C', // Vermelho escuro
      secondary: '#EF5350', // Vermelho médio
      background: '#0D1F0D', // Verde escuro
      backgroundDark: '#071207', // Verde mais escuro
      text: '#FFFFFF', // Branco
      accent: '#FF5252', // Vermelho claro
      tertiary: '#FF8A80', // Vermelho ainda mais claro
    },
    bannerImage: '/images/Casas/AlmaDasAguasFlamejantes/banner.jpg',
    flagImage: '/images/Casas/AlmaDasAguasFlamejantes/bandeira.jpg',
  },
  [HOUSE_IDS.CHAMAS_RUGIDO]: {
    id: HOUSE_IDS.CHAMAS_RUGIDO,
    name: 'Chamas do Rugido',
    visualTheme: 'dark-red',
    colors: {
      primary: '#B71C1C', // Vermelho escuro
      secondary: '#EF5350', // Vermelho médio
      background: '#121212', // Preto
      backgroundDark: '#080808', // Preto mais escuro
      text: '#FFFFFF', // Branco
      accent: '#FF5252', // Vermelho claro
      tertiary: '#FF8A80', // Vermelho ainda mais claro
    },
    bannerImage: '/images/Casas/ChamasDoRugido/banner.jpg',
    flagImage: '/images/Casas/ChamasDoRugido/bandeira.png',
  },
  [HOUSE_IDS.KAZOKU_OKAMI]: {
    id: HOUSE_IDS.KAZOKU_OKAMI,
    name: 'Kazoku no Okami',
    visualTheme: 'light-blue',
    colors: {
      primary: '#40A9FF', // Azul celeste
      secondary: '#FFFFFF', // Branco
      background: '#003A6C', // Azul profundo
      backgroundDark: '#00264A', // Azul profundo mais escuro
      text: '#FFFFFF', // Branco
      accent: '#69C0FF', // Azul celeste claro
      tertiary: '#BAEAFF', // Azul muito claro
    },
    bannerImage: '/images/Casas/KazokuNoOkami/banner.jpg',
    flagImage: '/images/Casas/KazokuNoOkami/bandeira.png',
  },
};

// Cores mais vibrantes para cada casa
export const vibrantHouseThemes: Record<string, HouseTheme> = {
  [HOUSE_IDS.FLOR_ESPIRITO_DOURADO]: {
    ...houseThemes[HOUSE_IDS.FLOR_ESPIRITO_DOURADO],
    colors: {
      primary: '#FFD700', // Dourado
      secondary: '#FFF9C4', // Amarelo claro
      background: '#121212', // Manter o fundo preto
      backgroundDark: '#050505', // Preto mais escuro
      text: '#FFFFFF', // Branco
      accent: '#FFEB3B', // Amarelo
      tertiary: '#FFF59D', // Amarelo bem claro
    }
  },
  [HOUSE_IDS.ORDEM_TRES_FACES]: {
    ...houseThemes[HOUSE_IDS.ORDEM_TRES_FACES],
    colors: {
      primary: '#6C63FF', // Roxo cibernético
      secondary: '#A89CFF', // Roxo claro
      background: '#0D0D1F', // Background cósmico
      backgroundDark: '#07071A', // Cósmico mais intenso
      text: '#FFFFFF', // Branco
      accent: '#7B73FF', // Roxo médio
      tertiary: '#8D85FF', // Roxo médio-claro
    }
  },
  [HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES]: {
    ...houseThemes[HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES],
    colors: {
      primary: '#D32F2F', // Vermelho vibrante
      secondary: '#EF5350', // Vermelho médio
      background: '#0D1F0D', // Verde escuro
      backgroundDark: '#071207', // Verde mais escuro
      text: '#FFFFFF', // Branco
      accent: '#FF5252', // Vermelho claro
      tertiary: '#FF8A80', // Vermelho bem claro
    }
  },
  [HOUSE_IDS.CHAMAS_RUGIDO]: {
    ...houseThemes[HOUSE_IDS.CHAMAS_RUGIDO],
    colors: {
      primary: '#D32F2F', // Vermelho vibrante
      secondary: '#EF5350', // Vermelho médio
      background: '#121212', // Preto
      backgroundDark: '#080808', // Preto mais escuro
      text: '#FFFFFF', // Branco
      accent: '#FF5252', // Vermelho claro
      tertiary: '#FF8A80', // Vermelho bem claro
    }
  },
  [HOUSE_IDS.KAZOKU_OKAMI]: {
    ...houseThemes[HOUSE_IDS.KAZOKU_OKAMI],
    colors: {
      primary: '#40A9FF', // Azul celeste
      secondary: '#FFFFFF', // Branco
      background: '#003A6C', // Azul profundo
      backgroundDark: '#00264A', // Azul profundo mais escuro
      text: '#FFFFFF', // Branco
      accent: '#69C0FF', // Azul celeste claro
      tertiary: '#BAEAFF', // Azul muito claro
    }
  }
};

// Tema padrão para usuários sem casa
export const defaultTheme: HouseTheme = {
  id: 'default',
  name: 'Mindforge',
  visualTheme: 'default',
  colors: {
    primary: '#215E45', // Verde Mindforge
    secondary: '#C5E8D5', // Verde claro
    background: '#121212', // Fundo escuro
    backgroundDark: '#080808', // Fundo ainda mais escuro
    text: '#FFFFFF', // Branco
    accent: '#FFD700', // Dourado
    tertiary: '#4CAF50', // Verde médio
  },
  bannerImage: '/images/Index/BannerPrincipal.png',
  flagImage: '/images/logo.png',
};

// Função auxiliar para obter o tema com base no ID da casa
export function getThemeByHouseId(houseId: string | null | undefined): HouseTheme {
  if (!houseId) return defaultTheme;
  
  // Usar as cores vibrantes (ou as padrão se não existirem cores vibrantes)
  return vibrantHouseThemes[houseId] || houseThemes[houseId] || defaultTheme;
}

// Função auxiliar para obter o tema com base no nome da casa
export function getThemeByHouseName(houseName: string | null | undefined): HouseTheme {
  if (!houseName) return defaultTheme;
  
  // Normaliza o nome da casa (remove acentos, converte para minúsculas)
  const normalizedName = houseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
  
  // Verifica nos temas existentes
  for (const themeKey in houseThemes) {
    const theme = houseThemes[themeKey];
    const themeName = theme.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-');
      
    if (normalizedName === themeName || 
        normalizedName.includes(themeName) || 
        themeName.includes(normalizedName)) {
      return theme;
    }
  }
  
  return defaultTheme;
}

// Função auxiliar para obter o tema com base no visualTheme
export function getThemeByVisualTheme(visualTheme: string | null | undefined): HouseTheme {
  if (!visualTheme) return defaultTheme;
  
  const houseId = VISUAL_THEMES[visualTheme as keyof typeof VISUAL_THEMES];
  return houseId ? houseThemes[houseId] : defaultTheme;
} 