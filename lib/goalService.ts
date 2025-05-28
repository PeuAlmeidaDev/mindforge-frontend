import api from './api';
import { API_ENDPOINTS } from './config';

interface Goal {
  id: string | number;
  goal: {
    name?: string;
    title?: string;
    description?: string;
    interest?: {
      name: string;
    };
    interests?: Array<{ name: string } | string>;
    goalInterests?: Array<{ interest: { name: string } }>;
    interestId?: string | { name: string };
  };
  completed: boolean;
  isOptional: boolean;
}

interface GoalResponse {
  success: boolean;
  message?: string;
  data?: Goal[];
}

export const fetchDailyGoals = async (): Promise<GoalResponse> => {
  try {
    const { data } = await api.get<GoalResponse>(API_ENDPOINTS.GOALS.DAILY);
    return data;
  } catch (error: any) {
    console.error('Erro ao buscar metas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao buscar metas',
      data: []
    };
  }
};

export const generateDailyGoals = async (): Promise<GoalResponse> => {
  try {
    const { data } = await api.post<GoalResponse>(API_ENDPOINTS.GOALS.GENERATE);
    return data;
  } catch (error: any) {
    console.error('Erro ao gerar metas:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao gerar metas',
      data: []
    };
  }
};

export const completeGoal = async (goalId: string | number): Promise<{ success: boolean; message?: string }> => {
  try {
    const { data } = await api.put(API_ENDPOINTS.GOALS.COMPLETE(goalId));
    return {
      success: true,
      message: 'Meta completada com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao completar meta:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Erro ao completar meta'
    };
  }
}; 