import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface para o estado do usuário
interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    houseId: number | null;
    avatar: string | null;
    level: number;
    experience: number;
    stats: {
      strength: number;
      intelligence: number;
      willpower: number;
      charisma: number;
      creativity: number;
    };
  } | null;
  setUser: (user: UserState['user']) => void;
  clearUser: () => void;
  updateStats: (stats: Partial<NonNullable<UserState['user']>['stats']>) => void;
  addExperience: (amount: number) => void;
}

// Cria o store com persistência em localStorage
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      
      setUser: (user) => set({ user }),
      
      clearUser: () => set({ user: null }),
      
      updateStats: (stats) => 
        set((state) => ({
          user: state.user 
            ? { 
                ...state.user, 
                stats: { ...state.user.stats, ...stats } 
              } 
            : null
        })),
      
      addExperience: (amount) => 
        set((state) => {
          if (!state.user) return { user: null };
          
          const newExperience = state.user.experience + amount;
          const expToNextLevel = state.user.level * 100;
          
          // Verifica se o usuário subiu de nível
          if (newExperience >= expToNextLevel) {
            return {
              user: {
                ...state.user,
                level: state.user.level + 1,
                experience: newExperience - expToNextLevel,
              }
            };
          }
          
          return {
            user: {
              ...state.user,
              experience: newExperience,
            }
          };
        }),
    }),
    {
      name: 'user-storage',
      skipHydration: true, // Permite que o Next.js hidrate o store no cliente
    }
  )
);

// Interface para o estado de metas do usuário
interface GoalsState {
  dailyGoals: Array<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    type: string;
    points: number;
  }>;
  addGoal: (goal: Omit<GoalsState['dailyGoals'][0], 'id' | 'createdAt'>) => void;
  completeGoal: (id: string) => void;
  resetDailyGoals: () => void;
}

// Store para gerenciar as metas diárias
export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      dailyGoals: [],
      
      addGoal: (goal) => 
        set((state) => ({
          dailyGoals: [
            ...state.dailyGoals,
            {
              ...goal,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            }
          ]
        })),
      
      completeGoal: (id) => 
        set((state) => ({
          dailyGoals: state.dailyGoals.map(goal => 
            goal.id === id ? { ...goal, completed: true } : goal
          )
        })),
      
      resetDailyGoals: () => set({ dailyGoals: [] }),
    }),
    {
      name: 'goals-storage',
      skipHydration: true,
    }
  )
); 