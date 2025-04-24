import { useState, useEffect } from 'react';
import useAuth from './useAuth';

export default function useHouseReveal() {
  const { user, isAuthenticated, isNewUser } = useAuth();
  const [showReveal, setShowReveal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Só continua se o usuário estiver autenticado e tiver uma casa
    if (!isAuthenticated || !user || !user.house) {
      setIsLoading(false);
      return;
    }

    // Se for um usuário recém-registrado, sempre mostra a animação
    if (isNewUser && user.house.id) {
      setShowReveal(true);
      setIsLoading(false);
      return;
    }

    // Se não for um usuário novo, verificar se já viu a animação antes
    const userHasSeenReveal = localStorage.getItem(`house_reveal_${user.id}`);
    
    if (!userHasSeenReveal && user.house && user.house.id) {
      setShowReveal(true);
    } else {
      setShowReveal(false);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated, isNewUser]);

  const completeReveal = () => {
    if (user && user.id) {
      localStorage.setItem(`house_reveal_${user.id}`, 'true');
      setShowReveal(false);
    }
  };

  return { showReveal, completeReveal, isLoading };
} 