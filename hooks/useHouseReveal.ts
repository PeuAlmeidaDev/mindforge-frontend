import { useState, useEffect } from 'react';
import useAuth from './useAuth';

export default function useHouseReveal() {
  const { user, isAuthenticated, isNewUser } = useAuth();
  const [showReveal, setShowReveal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedSession, setCheckedSession] = useState(false);

  useEffect(() => {
    // Se já verificamos nesta sessão, não exibe a animação novamente
    if (checkedSession) {
      setIsLoading(false);
      return;
    }

    // Só continua se o usuário estiver autenticado e tiver uma casa
    if (!isAuthenticated || !user || !user.house) {
      setIsLoading(false);
      return;
    }

    // Verificar se já viu a animação antes usando localStorage
    const userHasSeenReveal = localStorage.getItem(`house_reveal_${user.id}`);
    
    // Marcar esta sessão como verificada para evitar verificações repetidas
    setCheckedSession(true);

    // Se for um usuário recém-registrado, sempre mostra a animação
    if (isNewUser && user.house.id && !userHasSeenReveal) {
      setShowReveal(true);
      setIsLoading(false);
      return;
    }

    // Para usuários existentes, só mostra se nunca viram antes
    if (!userHasSeenReveal && user.house && user.house.id) {
      setShowReveal(true);
    } else {
      setShowReveal(false);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated, isNewUser, checkedSession]);

  const completeReveal = () => {
    if (user && user.id) {
      localStorage.setItem(`house_reveal_${user.id}`, 'true');
      setShowReveal(false);
    }
  };

  return { showReveal, completeReveal, isLoading };
} 