import { useState, useEffect } from 'react';

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export function useInterests() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/interests');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar interesses. Tente novamente mais tarde.');
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setInterests(data.data);
      } else {
        throw new Error('Formato de resposta inválido ao buscar interesses.');
      }
    } catch (error) {
      console.error('Erro ao buscar interesses:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar interesses');
      // Não definimos uma lista de fallback para manter o sistema 100% dinâmico
      setInterests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  return {
    interests,
    isLoading,
    error,
    fetchInterests
  };
}

export default useInterests; 