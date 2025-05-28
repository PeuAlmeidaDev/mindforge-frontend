import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import useHouseTheme from '../hooks/useHouseTheme';
import useHouseReveal from '../hooks/useHouseReveal';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import HouseRevealAnimation from '../components/HouseRevealAnimation';
import { fetchDailyGoals, generateDailyGoals, completeGoal } from '../lib/goalService';

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
  const { user, isAuthenticated, isLoading, refreshUserData } = useAuth();
  const { refreshUserData: refreshUserProfile } = useUser();
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

  // Função para atualizar os dados do usuário
  const updateUserData = async () => {
    console.log('Atualizando dados do usuário no Dashboard');
    if (refreshUserData) await refreshUserData();
    if (refreshUserProfile) await refreshUserProfile();
  };

  // Efeito para autenticação e visibilidade do dashboard
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
    
    if (isAuthenticated && user) {
      updateUserData();
    }
    
    setDashboardVisible(!showReveal);
  }, [isAuthenticated, isLoading, router, user, showReveal]);
  
  // Efeito para carregar metas
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Carregando metas uma única vez');
      fetchUserGoals();
    }
  }, [isAuthenticated, user]);

  // Função para extrair o nome do interesse
  const getInterestName = (goal: any): string => {
    if (!goal) return 'Geral';
    
    if (goal.interest?.name) return goal.interest.name;
    if (goal.interests?.[0]?.name) return goal.interests[0].name;
    if (typeof goal.interests?.[0] === 'string') return goal.interests[0];
    if (goal.goalInterests?.[0]?.interest?.name) return goal.goalInterests[0].interest.name;
    if (goal.interestId?.name) return goal.interestId.name;
    if (goal.interestId) return `Interesse #${goal.interestId}`;
    
    return 'Geral';
  };

  // Função para extrair o título da meta
  const getGoalTitle = (goal: any, item: any): string => {
    return goal?.name || goal?.title || goal?.description || item.name || item.title || 'Meta sem título';
  };

  // Função para buscar metas do usuário
  const fetchUserGoals = async () => {
    setLoadingGoals(true);
    
    try {
      const response = await fetchDailyGoals();
      
      if (response.success && response.data) {
        const formattedGoals = response.data
          .map((item, index) => {
            if (!item.goal) {
              console.error('Meta sem informações de goal:', item);
              return null;
            }
            
            return {
              id: item.id,
              internalId: index,
              title: getGoalTitle(item.goal, item),
              completed: Boolean(item.completed),
              type: getInterestName(item.goal),
              optional: Boolean(item.isOptional),
              apiId: item.id
            };
          })
          .filter(Boolean);
        
        setGoals(formattedGoals);
      } else {
        console.error('Erro ao buscar metas:', response.message);
        setGoals([]);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setGoals([]);
    } finally {
      setLoadingGoals(false);
    }
  };

  // Função para tentar buscar metas várias vezes
  const pollingFetchGoals = async (attempts = 3, delay = 1000): Promise<boolean> => {
    await fetchUserGoals();
    
    if (goals.length > 0) {
      console.log('Metas encontradas na primeira tentativa');
      return true;
    }
    
    return new Promise(resolve => {
      let currentAttempt = 1;
      
      const tryAgain = async () => {
        if (currentAttempt >= attempts) {
          console.log(`Nenhuma meta encontrada após ${attempts} tentativas`);
          resolve(false);
          return;
        }
        
        currentAttempt++;
        console.log(`Tentativa ${currentAttempt} de ${attempts} para buscar metas...`);
        
        await fetchUserGoals();
        
        if (goals.length > 0) {
          console.log(`Metas encontradas na tentativa ${currentAttempt}`);
          resolve(true);
          return;
        }
        
        setTimeout(tryAgain, delay);
      };
      
      setTimeout(tryAgain, delay);
    });
  };

  // Função para gerar metas diárias
  const handleGenerateGoals = async () => {
    try {
      setLoadingGoals(true);
      
      const response = await generateDailyGoals();
      
      if (response.success && response.data) {
        const formattedGoals = response.data
          .map((item, index) => {
            if (!item.goal) return null;
            
            return {
              id: item.id,
              internalId: index,
              title: getGoalTitle(item.goal, item),
              completed: Boolean(item.completed),
              type: getInterestName(item.goal),
              optional: Boolean(item.isOptional),
              apiId: item.id
            };
          })
          .filter(Boolean);
        
        setGoals(formattedGoals);
      } else {
        console.error('Erro ao gerar metas:', response.message);
        const success = await pollingFetchGoals(5, 1000);
        
        if (!success) {
          console.warn('Não foi possível carregar as metas após várias tentativas');
        }
      }
    } catch (error) {
      console.error('Erro ao gerar metas:', error);
      throw error;
    } finally {
      setLoadingGoals(false);
    }
  };

  // Função para marcar uma meta como concluída
  const handleGoalComplete = async (goalId: string | number) => {
    const goalToUpdate = goals.find(goal => goal.id === goalId);
    if (!goalToUpdate) return;
    
    try {
      const response = await completeGoal(goalToUpdate.apiId);
      
      if (response.success) {
        setGoals(prevGoals => 
          prevGoals.map(goal => 
            goal.id === goalId ? { ...goal, completed: true } : goal
          )
        );
        
        updateUserData();
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
        <title>Dashboard | Mindforge</title>
        <meta name="description" content="Seu painel de controle no Mindforge" />
      </Head>

      {showReveal ? (
        <HouseRevealAnimation onComplete={handleRevealComplete} />
      ) : (
        <DashboardLayout theme={theme}>
          <HeaderSection
            theme={theme}
            user={user}
            houseName={houseName}
            hasHouse={hasHouse}
            houseId={houseId}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6">
            <HouseStatusCard
              theme={theme}
              houseName={houseName}
              houseId={houseId}
              router={router}
            />
            
            <DailyGoalsCard
              theme={theme}
              goals={goals}
              loadingGoals={loadingGoals}
              onGoalComplete={handleGoalComplete}
              onGenerateGoals={handleGenerateGoals}
            />
            
            <UserStatsCard
              theme={theme}
              user={user}
              hasHouse={hasHouse}
            />
          </div>
          
          <ActivityFeedCard
            theme={theme}
            activities={activities}
            hasHouse={hasHouse}
          />
        </DashboardLayout>
      )}
    </>
  );
} 