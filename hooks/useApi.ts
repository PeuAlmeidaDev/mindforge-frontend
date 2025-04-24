import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Função para fazer requisições HTTP
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Ocorreu um erro na requisição');
  }

  return response.json();
}

// Hook para buscar dados da API
export function useFetchData<T>(
  endpoint: string,
  queryKey: string[],
  schema?: z.ZodType<T>,
  options = {}
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const data = await fetchApi<T>(endpoint);
      
      // Validação com Zod se um schema for fornecido
      if (schema) {
        return schema.parse(data);
      }
      
      return data;
    },
    ...options,
  });
}

// Hook para enviar dados para a API (POST, PUT, DELETE)
export function useMutateData<T, R>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE',
  mutationKey: string[],
  schema?: z.ZodType<R>
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey,
    mutationFn: async (data: T) => {
      const response = await fetchApi<R>(endpoint, {
        method,
        body: JSON.stringify(data),
      });
      
      // Validação com Zod se um schema for fornecido
      if (schema) {
        return schema.parse(response);
      }
      
      return response;
    },
    onSuccess: () => {
      // Invalida as queries relacionadas para atualizar os dados
      queryClient.invalidateQueries({ queryKey: [mutationKey[0]] });
    },
  });
}

// Exemplo de hook para autenticação
export function useLogin() {
  return useMutateData<
    { email: string; password: string },
    { token: string; user: any }
  >('/auth/login', 'POST', ['auth']);
}

// Exemplo de hook para buscar usuário atual
export function useCurrentUser() {
  return useFetchData('/users/me', ['currentUser']);
}

// Exemplo de hook para buscar metas do usuário
export function useDailyGoals() {
  return useFetchData('/goals/daily', ['goals', 'daily']);
}

// Exemplo de hook para completar uma meta
export function useCompleteGoal() {
  return useMutateData<{ goalId: string }, { success: boolean }>(
    '/goals/complete',
    'POST',
    ['goals']
  );
} 