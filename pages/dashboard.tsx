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

  // Função para extrair o nome do interesse de forma segura, lidando com diferentes estruturas
  const getInterestName = (goal: any): string => {
    if (!goal) return 'Geral';
    
    // Caso 1: Objeto interest está diretamente em goal
    if (goal.interest && goal.interest.name) {
      return goal.interest.name;
    }
    
    // Caso 2: Um array de interests dentro de goal
    if (goal.interests && Array.isArray(goal.interests) && goal.interests.length > 0) {
      // Caso 2.1: Interests são objetos completos
      if (typeof goal.interests[0] === 'object' && goal.interests[0].name) {
        return goal.interests[0].name;
      }
      
      // Caso 2.2: Interests são apenas strings
      if (typeof goal.interests[0] === 'string') {
        return goal.interests[0];
      }
    }
    
    // Caso 3: Interest está em goalInterests
    if (goal.goalInterests && Array.isArray(goal.goalInterests) && goal.goalInterests.length > 0) {
      const interest = goal.goalInterests[0].interest;
      if (interest && interest.name) {
        return interest.name;
      }
    }
    
    // Caso 4: Interest está em interestId
    if (goal.interestId) {
      return typeof goal.interestId === 'object' && goal.interestId.name
        ? goal.interestId.name
        : 'Interesse #' + goal.interestId;
    }
    
    return 'Geral';
  };

  // Função para extrair o nome da meta de forma segura
  const getGoalTitle = (goal: any, item: any): string => {
    // Verificar vários formatos possíveis para o título
    
    // Verificar na propriedade name do goal
    if (goal && goal.name) {
      return goal.name;
    }
    
    // Verificar na propriedade title do goal
    if (goal && goal.title) {
      return goal.title;
    }
    
    // Verificar na propriedade description do goal
    if (goal && goal.description) {
      return goal.description;
    }
    
    // Verificar diretamente no item
    if (item.name) {
      return item.name;
    }
    
    // Verificar diretamente no item
    if (item.title) {
      return item.title;
    }
    
    // Fallback
    return 'Meta sem título';
  };

  // Função para buscar metas do usuário da API
  const fetchUserGoals = async () => {
    setLoadingGoals(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Buscando metas do usuário...');
      
      const response = await fetch(API_ENDPOINTS.GOALS.DAILY, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Resposta completa:', responseData);
        
        if (!responseData.data || !Array.isArray(responseData.data)) {
          console.error('Formato de resposta inválido:', responseData);
          setGoals([]);
          return;
        }
        
        if (responseData.data.length === 0) {
          console.log('Nenhuma meta encontrada para o usuário');
          setGoals([]);
          return;
        }
        
        console.log('Metas encontradas:', responseData.data.length);
        
        // Para debug - verificar a estrutura do primeiro item
        if (responseData.data.length > 0) {
          console.log('Estrutura da primeira meta:', JSON.stringify(responseData.data[0], null, 2));
          // Verificar explicitamente cada campo possível para o título
          const firstItem = responseData.data[0];
          const firstGoal = firstItem.goal;
          console.log('Possíveis campos para título:');
          console.log('- goal.name:', firstGoal?.name);
          console.log('- goal.title:', firstGoal?.title);
          console.log('- goal.description:', firstGoal?.description);
          console.log('- item.name:', firstItem?.name);
          console.log('- item.title:', firstItem?.title);
        }
        
        // Mapeamento mais resistente a diferentes estruturas de dados
        const formattedGoals = responseData.data.map((item: any, index: number) => {
          // Verificar se goal existe
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
        }).filter(Boolean); // Remover itens nulos
        
        console.log('Metas formatadas:', formattedGoals);
        
        // Atualizar o estado apenas se o componente ainda estiver montado
        setGoals(formattedGoals);
      } else {
        console.error('Erro ao buscar metas:', response.statusText);
        // Tentar obter informações de erro
        try {
          const errorData = await response.json();
          console.error('Detalhes do erro:', errorData);
        } catch (e) {
          console.error('Não foi possível obter detalhes do erro');
        }
        
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
    // Primeira tentativa
    await fetchUserGoals();
    
    // Verificar se metas foram encontradas na primeira tentativa
    if (goals && goals.length > 0) {
      console.log('Metas encontradas na primeira tentativa');
      return true;
    }
    
    // Se não houver metas na primeira tentativa, tentar novamente
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
        
        try {
          await fetchUserGoals();
          // Verificar diretamente no estado mais atual
          const updatedGoals = await fetch(API_ENDPOINTS.GOALS.DAILY, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }).then(res => res.json());
          
          if (updatedGoals.data && updatedGoals.data.length > 0) {
            console.log(`Metas encontradas na tentativa ${currentAttempt}`);
            
            // Atualizar o estado diretamente
            const formattedGoals = updatedGoals.data.map((item: any, index: number) => {
              if (!item.goal) {
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
            }).filter(Boolean);
            
            setGoals(formattedGoals);
            resolve(true);
            return;
          }
          
          // Tentar novamente após o delay
          setTimeout(tryAgain, delay);
        } catch (error) {
          console.error('Erro ao buscar metas durante polling:', error);
          setTimeout(tryAgain, delay);
        }
      };
      
      // Iniciar o processo de retry
      setTimeout(tryAgain, delay);
    });
  };

  // Função para gerar metas diárias
  const handleGenerateGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      
      console.log('Iniciando geração de metas diárias...');
      setLoadingGoals(true);
      
      const response = await fetch(API_ENDPOINTS.GOALS.GENERATE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status da resposta da geração:', response.status);
      
      const data = await response.json();
      console.log('Resposta da geração:', data);
      
      if (response.ok) {
        console.log('Metas geradas com sucesso!', data.message);
        
        // Verificar se há metas nos dados retornados
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log(`${data.data.length} metas foram geradas`);
          
          // Formatar diretamente as metas recebidas
          const formattedGoals = data.data.map((item: any, index: number) => {
            if (!item.goal) {
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
          }).filter(Boolean);
          
          // Atualizar o estado diretamente
          setGoals(formattedGoals);
          setLoadingGoals(false);
          return;
        }
        
        // Se não tiver dados na resposta, tenta buscar via polling
        const success = await pollingFetchGoals(5, 1000);
        
        if (!success) {
          console.warn('Não foi possível carregar as metas após várias tentativas. O usuário precisará atualizar a página.');
        }
      } else {
        console.error('Erro ao gerar metas:', data.message || 'Erro desconhecido');
        throw new Error(data.message || 'Erro ao gerar metas diárias');
      }
    } catch (error) {
      console.error('Erro ao gerar metas:', error);
      throw error; // Repassar o erro para o componente tratar
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
                onGenerateGoals={handleGenerateGoals}
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