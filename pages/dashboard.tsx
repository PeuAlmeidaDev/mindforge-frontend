import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';
import useHouseReveal from '../hooks/useHouseReveal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import HouseRevealAnimation from '../components/HouseRevealAnimation';
import { API_ENDPOINTS } from '../lib/config';

// Componentes extraídos
import LoadingScreen from '../components/dashboard/LoadingScreen';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import HeaderSection from '../components/dashboard/HeaderSection';
import HouseStatusCard from '../components/dashboard/HouseStatusCard';
import DailyGoalsCard from '../components/dashboard/DailyGoalsCard';
import UserStatsCard from '../components/dashboard/UserStatsCard';
import ActivityFeedCard from '../components/dashboard/ActivityFeedCard';

// Interface para o tipo Activity
interface Activity {
  id: number;
  text: string;
  icon: string;
  timestamp: string;
}

// Dados mockados para o feed de atividades enquanto não temos essa API
const MOCK_ACTIVITIES: Activity[] = [
  { id: 1, text: 'Sua casa subiu para 3º no ranking!', icon: '', timestamp: '2h atrás' },
  { id: 2, text: 'Novo desafio de casa disponível', icon: '', timestamp: '5h atrás' },
  { id: 3, text: 'Você ganhou 3 batalhas consecutivas', icon: '', timestamp: '1d atrás' },
  { id: 4, text: 'Novo torneio PvP em 2 dias', icon: '', timestamp: '2d atrás' },
];

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme } = useHouseTheme();
  const { showReveal, completeReveal, isLoading: revealLoading } = useHouseReveal();
  const [goals, setGoals] = useState<any[]>([]);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [dashboardVisible, setDashboardVisible] = useState(!showReveal);
  
  // Outras informações baseadas no usuário
  const houseId = user?.house?.id || '';
  const hasHouse = Boolean(user && user.house && user.house.name);
  const houseName = user?.house?.name || 'Sem Casa';

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
    
    // Buscar metas do usuário se estiver autenticado
    if (isAuthenticated && user) {
      fetchUserGoals();
    }
    
    // Atualizar visibilidade do dashboard quando o estado de showReveal mudar
    setDashboardVisible(!showReveal);
  }, [isAuthenticated, isLoading, router, user, showReveal]);

  // Função para buscar metas do usuário da API
  const fetchUserGoals = async () => {
    setLoadingGoals(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.GOALS.DAILY, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const { data } = await response.json();
        
        const formattedGoals = data.map((item: any, index: number) => ({
          id: item.id,
          internalId: index,
          title: item.goal.name,
          completed: item.completed,
          type: item.goal.interest.name,
          optional: item.isOptional,
          apiId: item.id
        }));
        
        setGoals(formattedGoals);
      } else {
        setGoals([]);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  // Função para marcar uma meta como concluída
  const handleGoalComplete = async (goalId: string | number) => {
    const goalToUpdate = goals.find(goal => goal.id === goalId);
    if (!goalToUpdate) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.GOALS.COMPLETE(goalToUpdate.apiId), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setGoals(prevGoals => 
          prevGoals.map(goal => 
            goal.id === goalId ? { ...goal, completed: true } : goal
          )
        );
        
        fetchUserGoals();
      }
    } catch (error) {
      console.error('Erro ao completar meta:', error);
    }
  };
  
  // Função para lidar com a conclusão da animação
  const handleRevealComplete = () => {
    completeReveal();
    setDashboardVisible(true);
  };

  // Exibir tela de carregamento enquanto verifica autenticação
  if (isLoading || revealLoading) {
    return <LoadingScreen theme={theme} />;
  }

  // Se não estiver autenticado, não exibe nada (será redirecionado pelo useEffect)
  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>{hasHouse ? `${houseName} | Mindforge` : 'Mindforge'}</title>
        <meta name="description" content="Gerencie sua jornada no Mindforge" />
      </Head>

      {/* Animação de revelação da casa */}
      {showReveal && (
        <HouseRevealAnimation onComplete={handleRevealComplete} />
      )}

      {/* Dashboard principal */}
      {dashboardVisible && (
        <DashboardLayout theme={theme}>
          {/* Header e Banner + Barra de Menu */}
          <HeaderSection 
            theme={theme} 
            user={user} 
            houseName={houseName} 
            hasHouse={hasHouse} 
            houseId={houseId}
          />
          
          {/* Conteúdo principal */}
          <main className="px-4 py-6 max-w-5xl mx-auto relative z-10">
            {/* Status da Casa */}
            {hasHouse && (
              <HouseStatusCard 
                theme={theme} 
                houseName={houseName} 
                router={router} 
                houseId={houseId}
              />
            )}
            
            {/* Grade principal de conteúdo */}
            <div className="space-y-6">
              {/* Metas Diárias */}
              <DailyGoalsCard 
                theme={theme} 
                goals={goals} 
                loadingGoals={loadingGoals} 
                onGoalComplete={handleGoalComplete} 
              />
              
              {/* Estatísticas do Usuário */}
              <UserStatsCard 
                theme={theme} 
                user={user} 
                hasHouse={hasHouse} 
              />
              
              {/* Feed de Atividades */}
              <ActivityFeedCard 
                theme={theme} 
                activities={activities} 
                hasHouse={hasHouse} 
              />
            </div>
          </main>
        </DashboardLayout>
      )}
    </>
  );
} 