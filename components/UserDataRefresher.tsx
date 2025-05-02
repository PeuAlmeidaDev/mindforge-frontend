import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';

// Componente para atualizar os dados do usuário automaticamente
const UserDataRefresher: React.FC = () => {
  const { refreshUserData } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Páginas onde queremos atualizar os dados do usuário automaticamente
    const refreshPages = ['/dashboard', '/profile', '/battle', '/house'];
    
    // Função para atualizar os dados
    const updateUserData = () => {
      // Verificar se a página atual está na lista de páginas para atualizar
      const shouldRefresh = refreshPages.some(page => router.pathname.startsWith(page));
      
      if (shouldRefresh) {
        refreshUserData();
      }
    };

    // Atualizar quando o componente montar
    updateUserData();

    // Adicionar listener para mudanças de rota
    router.events.on('routeChangeComplete', updateUserData);

    // Limpar listener ao desmontar
    return () => {
      router.events.off('routeChangeComplete', updateUserData);
    };
  }, [router, refreshUserData]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default UserDataRefresher; 