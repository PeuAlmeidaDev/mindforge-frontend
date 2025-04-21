// Define a interface para o tema de cada casa
export interface HouseTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  bannerImage: string;
  flagImage: string;
}

// Constantes para os IDs das casas (para evitar erros de digitação)
export const HOUSE_IDS = {
  FLOR_ESPIRITO_DOURADO: 'flor-espirito-dourado',
  ORDEM_TRES_FACES: 'ordem-tres-faces',
  ALMA_AGUAS_FLAMEJANTES: 'alma-aguas-flamejantes',
  CHAMAS_RUGIDO: 'chamas-rugido',
  KAZOKU_OKAMI: 'kazoku-okami',
};

// Define os temas para cada casa
export const houseThemes: Record<string, HouseTheme> = {
  [HOUSE_IDS.FLOR_ESPIRITO_DOURADO]: {
    id: HOUSE_IDS.FLOR_ESPIRITO_DOURADO,
    name: 'FLOR DO ESPÍRITO DOURADO',
    colors: {
      primary: '#FFD700', // Dourado
      secondary: '#FFFFFF', // Branco
      background: '#121212', // Preto
      text: '#FFFFFF', // Branco
      accent: '#E6C200', // Dourado mais escuro
    },
    bannerImage: '/images/Casas/FlorDoEspiritoDourado/banner.jpg',
    flagImage: '/images/Casas/FlorDoEspiritoDourado/bandeira.jpg',
  },
  [HOUSE_IDS.ORDEM_TRES_FACES]: {
    id: HOUSE_IDS.ORDEM_TRES_FACES,
    name: 'ORDEM DAS TRÊS FACES',
    colors: {
      primary: '#6C63FF', // Roxo cibernético
      secondary: '#9089FF', // Roxo mais claro
      background: '#0D0A22', // Background cósmico escuro
      text: '#FFFFFF', // Branco
      accent: '#42C2FF', // Azul cibernético
    },
    bannerImage: '/images/Casas/OrdemDasTresFaces/banner.jpg',
    flagImage: '/images/Casas/OrdemDasTresFaces/bandeira.jpg',
  },
  [HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES]: {
    id: HOUSE_IDS.ALMA_AGUAS_FLAMEJANTES,
    name: 'ALMA DAS ÁGUAS FLAMEJANTES',
    colors: {
      primary: '#FF4A3F', // Vermelho
      secondary: '#4AEDD9', // Azul água
      background: '#01251a', // Verde escuro
      text: '#FFFFFF', // Branco
      accent: '#FF7A72', // Vermelho mais claro
    },
    bannerImage: '/images/Casas/AlmaDasAguasFlamejantes/banner.jpg',
    flagImage: '/images/Casas/AlmaDasAguasFlamejantes/bandeira.jpg',
  },
  [HOUSE_IDS.CHAMAS_RUGIDO]: {
    id: HOUSE_IDS.CHAMAS_RUGIDO,
    name: 'CHAMAS DO RUGIDO',
    colors: {
      primary: '#FF4500', // Vermelho fogo
      secondary: '#FFA500', // Laranja
      background: '#121212', // Preto
      text: '#FFFFFF', // Branco
      accent: '#FF6A33', // Vermelho mais claro
    },
    bannerImage: '/images/Casas/ChamasDoRugido/banner.jpg',
    flagImage: '/images/Casas/ChamasDoRugido/bandeira.png',
  },
  [HOUSE_IDS.KAZOKU_OKAMI]: {
    id: HOUSE_IDS.KAZOKU_OKAMI,
    name: 'KAZOKU NO OKAMI',
    colors: {
      primary: '#004080', // Azul profundo
      secondary: '#87CEEB', // Azul celeste
      background: '#001F40', // Azul profundo mais escuro
      text: '#FFFFFF', // Branco
      accent: '#00BFFF', // Azul claro
    },
    bannerImage: '/images/Casas/KazokuNoOkami/banner.jpg',
    flagImage: '/images/Casas/KazokuNoOkami/bandeira.png',
  },
};

// Tema padrão para usuários sem casa
export const defaultTheme: HouseTheme = {
  id: 'default',
  name: 'MINDFORGE',
  colors: {
    primary: '#215E45', // Verde Mindforge
    secondary: '#C5E8D5', // Verde claro
    background: '#121212', // Fundo escuro
    text: '#FFFFFF', // Branco
    accent: '#FFD700', // Dourado
  },
  bannerImage: '/images/Index/BannerPrincipal.png',
  flagImage: '/images/logo.png',
};

// Função auxiliar para obter o tema com base no nome da casa
export function getThemeByHouseName(houseName: string | null | undefined): HouseTheme {
  if (!houseName) return defaultTheme;
  
  // Normaliza o nome da casa (remove acentos, converte para minúsculas)
  const normalizedName = houseName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
  
  // Verifica se o nome normalizado corresponde a algum ID de casa
  for (const [id, theme] of Object.entries(houseThemes)) {
    if (normalizedName.includes(id.replace(/-/g, '')) || 
        id.replace(/-/g, '').includes(normalizedName)) {
      return theme;
    }
  }
  
  return defaultTheme;
} 