import { useFetchData, useMutateData } from './useApi';
import { z } from 'zod';
import { API_ENDPOINTS } from '../lib/config';

// Schema para validação de metas
const goalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  dueDate: z.string().optional(),
  points: z.number()
});

const goalsResponseSchema = z.object({
  data: z.array(goalSchema)
});

// Hook para buscar metas diárias
export function useDailyGoals() {
  return useFetchData(
    API_ENDPOINTS.GOALS.DAILY,
    ['goals', 'daily'],
    goalsResponseSchema
  );
}

// Hook para completar uma meta
export function useCompleteGoal() {
  return useMutateData<
    { goalId: string },
    { success: boolean; points: number }
  >(
    '/goals/complete',
    'POST',
    ['goals']
  );
}

export default {
  useDailyGoals,
  useCompleteGoal
}; 