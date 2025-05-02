import { useState, useCallback, useRef } from 'react';
import useAuth from './useAuth';

const useUser = () => {
  const { user, token, setUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Referência para controlar a limitação de chamadas frequentes
  const lastUpdateRef = useRef<number>(0);
  const updateThreshold = 5000; // 5 segundos entre atualizações

  // Função para atualizar os dados do usuário a partir da API
  const refreshUserData = useCallback(async (force = false) => {
    if (!token) {
      setError('Não há token de autenticação disponível');
      return null;
    }

    // Verificar se passou tempo suficiente desde a última atualização
    const now = Date.now();
    if (!force && now - lastUpdateRef.current < updateThreshold) {
      console.log('Atualização de dados ignorada (muito frequente)');
      return user; // Retorna os dados atuais do usuário
    }
    
    // Atualizar timestamp da última atualização
    lastUpdateRef.current = now;
    
    console.log('Atualizando dados do usuário via API');
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar dados do usuário');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Atualizar o contexto de autenticação com os novos dados
        setUser(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Erro ao obter dados atualizados');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao atualizar dados do usuário:', errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [token, setUser, user]);

  // Função para atualizar dados do usuário após uma batalha
  const updateAfterBattle = useCallback(async (battleId: string) => {
    if (!token || !battleId) {
      setError('Dados insuficientes para atualizar após batalha');
      return null;
    }

    setIsUpdating(true);
    setError(null);

    try {
      // Forçar atualização após uma batalha, independente do tempo passado
      await refreshUserData(true);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao atualizar após batalha:', errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [token, refreshUserData]);

  return {
    user,
    isUpdating,
    error,
    refreshUserData,
    updateAfterBattle
  };
};

export default useUser; 