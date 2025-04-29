// Configurações para ambientes de desenvolvimento e produção
const DEV_API_URL = 'http://localhost:3000/api';
const PROD_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mindforge-api.vercel.app/api';

// Definir a URL base da API com base no ambiente
export const API_URL = process.env.NODE_ENV === 'production' 
  ? PROD_API_URL 
  : DEV_API_URL;

// Endpoints específicos da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    PROFILE: `${API_URL}/auth/profile`,
  },
  GOALS: {
    DAILY: `${API_URL}/goals/daily`,
    COMPLETE: (goalId: string | number) => `${API_URL}/goals/complete/${goalId}`,
    GENERATE: `${API_URL}/goals/generate`,
  },
  HOUSES: {
    INFO: (houseId: string) => `${API_URL}/houses/${houseId}`,
    MEMBERS: (houseId: string) => `${API_URL}/houses/${houseId}/members`,
    RANKINGS: `${API_URL}/houses/rankings`,
  },
  INTERESTS: {
    LIST: `${API_URL}/interests`,
  },
  USERS: {
    STATS: (userId: string) => `${API_URL}/users/${userId}/stats`,
  },
  BATTLES: {
    LIST: `${API_URL}/battles`,
    DETAIL: (battleId: string) => `${API_URL}/battles/${battleId}`,
    CREATE_RANDOM: `${API_URL}/battles/random`,
    PROCESS_TURN: (battleId: string) => `${API_URL}/battles/${battleId}/turn`,
    REWARDS: (battleId: string) => `${API_URL}/battles/${battleId}/rewards`,
  }
};

// Tipos elementais padronizados (compartilhados entre todos os componentes)
export const ELEMENTAL_TYPES = {
  FIRE: 'FIRE', 
  WATER: 'WATER',
  EARTH: 'EARTH',
  AIR: 'AIR',
  LIGHT: 'LIGHT',
  DARK: 'DARK',
  NATURE: 'NATURE',  // Padronizado para NATURE em vez de NORMAL
  ELECTRIC: 'ELECTRIC', // Padronizado para ELECTRIC em vez de LIGHTNING
  ICE: 'ICE',
  PSYCHIC: 'PSYCHIC',
  GHOST: 'GHOST',
  STEEL: 'STEEL',    // Padronizado para STEEL em vez de FAIRY
  POISON: 'POISON',
  FLYING: 'FLYING',  // Padronizado para FLYING em vez de DRAGON
  ROCK: 'ROCK'       // Padronizado para ROCK em vez de duplicar NORMAL
};

// Mapeamento de tipos elementais de português para inglês
export const ELEMENTAL_TYPE_MAPPING: Record<string, string> = {
  'fogo': ELEMENTAL_TYPES.FIRE,
  'água': ELEMENTAL_TYPES.WATER,
  'terra': ELEMENTAL_TYPES.EARTH,
  'ar': ELEMENTAL_TYPES.AIR,
  'luz': ELEMENTAL_TYPES.LIGHT,
  'sombra': ELEMENTAL_TYPES.DARK,
  'natureza': ELEMENTAL_TYPES.NATURE,
  'elétrico': ELEMENTAL_TYPES.ELECTRIC,
  'gelo': ELEMENTAL_TYPES.ICE,
  'psíquico': ELEMENTAL_TYPES.PSYCHIC,
  'fantasma': ELEMENTAL_TYPES.GHOST,
  'aço': ELEMENTAL_TYPES.STEEL,
  'veneno': ELEMENTAL_TYPES.POISON,
  'voador': ELEMENTAL_TYPES.FLYING,
  'pedra': ELEMENTAL_TYPES.ROCK
};

export default {
  API_URL,
  API_ENDPOINTS,
  ELEMENTAL_TYPES,
  ELEMENTAL_TYPE_MAPPING
}; 