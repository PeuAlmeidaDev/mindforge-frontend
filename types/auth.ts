export interface User {
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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterUserData) => Promise<void>;
  logout: () => void;
  error: string | null;
  isNewUser: boolean;
  token: string | null;
  setUser: (user: User) => void;
  refreshUserData: () => Promise<void>;
}

// Interface para dados de registro
export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  primaryElementalType: string;
  interests: string[];
} 