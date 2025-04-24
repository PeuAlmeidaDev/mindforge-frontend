import { QueryClient } from '@tanstack/react-query';

// Cria uma instância do QueryClient com configurações personalizadas
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Desativa refetch automático quando a janela ganha foco
      retry: 1, // Número de tentativas em caso de erro
      staleTime: 5 * 60 * 1000, // 5 minutos antes de considerar os dados desatualizados
    },
  },
}); 