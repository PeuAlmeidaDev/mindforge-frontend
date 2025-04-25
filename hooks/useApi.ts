import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { API_URL } from '../lib/config';

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

// Exportação de funções auxiliares
export const api = {
  fetchApi,
  fetch: fetchApi // Alias para compatibilidade
}; 