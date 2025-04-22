import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import GoalsList from '../components/dashboard/GoalsList';
import UserStatsMin from '../components/dashboard/UserStatsMin';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import HouseBanner from '../components/dashboard/HouseBanner';
import { getThemeByHouseId } from '../lib/houseThemes';

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
  const { theme: hookTheme } = useHouseTheme();
  const [goals, setGoals] = useState<any[]>([]);
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [loadingGoals, setLoadingGoals] = useState(true);
  
  // Obtendo o tema da casa
  const houseId = user?.house?.id || '';
  const theme = user?.house?.id ? getThemeByHouseId(user.house.id) : hookTheme;
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
  }, [isAuthenticated, isLoading, router, user]);

  // Função para buscar metas do usuário da API
  const fetchUserGoals = async () => {
    setLoadingGoals(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/goals/daily', {
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
      const response = await fetch(`http://localhost:3000/api/goals/complete/${goalToUpdate.apiId}`, {
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

  // Função para obter o caminho do emblema da casa
  const getHouseEmblemPath = () => {
    if (!hasHouse) return '';
    
    let folder = '';
    switch (houseName) {
      case 'Flor do Espírito Dourado': folder = 'FlorDoEspiritoDourado'; break;
      case 'Ordem das Três Faces': folder = 'OrdemDasTresFaces'; break;
      case 'Alma das Águas Flamejantes': folder = 'AlmaDasAguasFlamejantes'; break;
      case 'Chamas do Rugido': folder = 'ChamasDoRugido'; break;
      case 'Kazoku no Okami': folder = 'KazokuNoOkami'; break;
      default: return '';
    }
    
    return `/images/Casas/${folder}/fundador.jpg`;
  };

  // Exibir tela de carregamento enquanto verifica autenticação
  if (isLoading) {
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
    </>
  );
}

// Componentes auxiliares para melhorar a organização

// Tela de carregamento 
const LoadingScreen = ({ theme }: { theme: any }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div 
      className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full"
      style={{ borderColor: theme.colors.primary }}
    ></div>
  </div>
);

// Layout do Dashboard com tema
const DashboardLayout = ({ theme, children }: { theme: any, children: React.ReactNode }) => (
  <div 
    className="min-h-screen relative overflow-hidden"
    style={{ 
      background: `linear-gradient(180deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
      color: theme.colors.text 
    }}
  >
    {/* Removendo os efeitos de padrão/textura que estavam vazios */}
    
    {children}
    
    {/* Estilos globais para efeitos */}
    <style jsx global>{`
      /* Efeito sutil de brilho para bordas com cor do tema */
      [style*="border-left"], [style*="border-top"], [style*="border-bottom"] {
        position: relative;
        overflow: hidden;
      }
      
      [style*="border-left"]::before, [style*="border-top"]::before, [style*="border-bottom"]::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.03;
        z-index: 0;
      }
      
      [style*="border-left"]::before {
        background: linear-gradient(90deg, ${theme.colors.primary}50, transparent 20%);
      }
      
      [style*="border-top"]::before {
        background: linear-gradient(180deg, ${theme.colors.primary}50, transparent 20%);
      }
      
      [style*="border-bottom"]::before {
        background: linear-gradient(0deg, ${theme.colors.primary}50, transparent 20%);
      }
    `}</style>
  </div>
);

// Seção do Header
const HeaderSection = ({ theme, user, houseName, hasHouse, houseId }: { 
  theme: any, 
  user: any, 
  houseName: string, 
  hasHouse: boolean,
  houseId: string
}) => {
  const router = useRouter();
  const { logout } = useAuth();
  
  return (
    <>
      <div 
        className="relative overflow-visible"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, ${theme.colors.primary}20 0%, transparent 100%)`,
          borderBottom: `1px solid ${theme.colors.primary}30`
        }}
      >
        <DashboardHeader 
          name={user?.username || 'Aventureiro'}
          level={user?.level || 1}
          elementalType={user?.primaryElementalType || 'Normal'}
          house={houseName}
          houseColor={theme.colors.primary}
        />
      </div>
      
      {/* Barra de menu horizontal */}
      <div className="sticky top-0 z-20 backdrop-blur-md transition-colors duration-300" style={{ 
        background: `rgba(${hexToRgb(theme.colors.backgroundDark)?.r || 6}, ${hexToRgb(theme.colors.backgroundDark)?.g || 20}, ${hexToRgb(theme.colors.backgroundDark)?.b || 36}, 0.85)`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.1)`
      }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-11">
            <div className="flex space-x-0.5 md:space-x-1">
              <MenuButton label="Início" isActive={true} theme={theme} />
              <MenuButton label="Batalha" onClick={() => router.push('/battle')} theme={theme} />
              <MenuButton label="Casa" onClick={() => router.push('/house')} theme={theme} />
              <MenuButton label="Ranking" onClick={() => router.push('/ranking')} theme={theme} />
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1.5 text-xs tracking-wide uppercase font-medium rounded-md transition-all hover:text-white hover:bg-opacity-10"
                style={{
                  color: `${theme.colors.text}90`,
                  backgroundColor: 'transparent'
                }}
                onClick={() => router.push('/profile')}
              >
                Perfil
              </button>
              <button 
                className="px-3 py-1.5 text-xs tracking-wide uppercase font-medium rounded-md transition-all hover:text-white hover:bg-red-900 hover:bg-opacity-20"
                style={{
                  color: `${theme.colors.text}90`,
                  backgroundColor: 'transparent'
                }}
                onClick={() => logout()}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Função auxiliar para converter hex para RGB
const hexToRgb = (hex: string) => {
  // Remove o # se existir
  hex = hex.replace('#', '');
  
  // Converte para valores RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Retorna objeto com valores r, g, b se a conversão for válida
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return { r, g, b };
};

// Componente para botão do menu
const MenuButton = ({ 
  label, 
  onClick, 
  isActive = false,
  theme
}: { 
  label: string; 
  onClick?: () => void; 
  isActive?: boolean;
  theme: any;
}) => (
  <button 
    className="relative px-3 py-2.5 transition-all duration-200 text-sm"
    onClick={onClick}
  >
    <span className={`relative z-10 ${
      isActive 
        ? 'font-medium' 
        : 'hover:text-white/80'
    }`}
    style={{
      color: isActive ? theme.colors.text : `${theme.colors.text}50`
    }}
    >
      {label}
    </span>
    
    {isActive && (
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 rounded-full" 
        style={{ backgroundColor: `${theme.colors.primary}40` }}
      />
    )}
  </button>
);

// Cartão de Status da Casa
const HouseStatusCard = ({ theme, houseName, router, houseId }: { theme: any, houseName: string, router: any, houseId: string }) => (
  <div 
    className="mb-6 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-all relative"
    style={{ 
      background: `linear-gradient(135deg, ${theme.colors.background}90 0%, ${theme.colors.primary}15 100%)`,
      borderLeft: `4px solid ${theme.colors.primary}`,
      borderBottom: `1px solid ${theme.colors.secondary}30`,
      boxShadow: `0 4px 15px ${theme.colors.primary}30`
    }}
  >
    <div className="absolute top-0 right-0 transform -translate-y-1/2 md:translate-y-0 md:translate-x-0 md:relative md:top-auto md:right-auto">
      <HouseBanner houseId={houseId} size="small" />
    </div>
    
    <div className="flex items-center">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` 
        }}
      >
        <span className="text-lg"></span>
      </div>
      <div>
        <h3 
          className="font-bold text-lg"
          style={{ color: theme.colors.primary }}
        >
          {houseName}
        </h3>
        <p className="text-sm opacity-70">Posição: #3 no ranking geral</p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <button 
        className="px-4 py-2 rounded-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.background}95 0%, ${theme.colors.primary}15 100%)`,
          border: `1px solid ${theme.colors.primary}40`,
          boxShadow: `0 2px 5px rgba(0,0,0,0.2)`
        }}
      >
        Ver Membros
      </button>
      <button 
        className="px-4 py-2 rounded-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary}90 100%)`,
          color: theme.colors.background,
          boxShadow: `0 2px 8px ${theme.colors.primary}60`
        }}
        onClick={() => router.push('/house-challenges')}
      >
        Desafios da Casa
      </button>
    </div>
  </div>
);

// Cartão de Metas Diárias
const DailyGoalsCard = ({ theme, goals, loadingGoals, onGoalComplete }: { 
  theme: any, 
  goals: any[], 
  loadingGoals: boolean, 
  onGoalComplete: (goalId: string | number) => void 
}) => (
  <section 
    className="backdrop-blur-sm rounded-xl p-6 transition-all"
    style={{ 
      background: `linear-gradient(160deg, ${theme.colors.background}85 0%, ${theme.colors.background}95 100%)`,
      borderTop: `4px solid ${theme.colors.primary}`,
      boxShadow: `0 10px 30px ${theme.colors.primary}10, inset 0 1px 0 ${theme.colors.primary}30`
    }}
  >
    <h2 
      className="text-xl font-bold mb-6 flex items-center"
      style={{ color: theme.colors.primary }}
    >
      <span className="mr-2"></span>
      Metas de Hoje
    </h2>
    
    {loadingGoals ? (
      <div className="py-10 flex justify-center">
        <div 
          className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin"
          style={{ 
            borderColor: `${theme.colors.primary}60`,
            borderTopColor: 'transparent',
            boxShadow: `0 0 10px ${theme.colors.primary}30`
          }}
        ></div>
      </div>
    ) : goals.length > 0 ? (
      <GoalsList 
        goals={goals} 
        onGoalComplete={onGoalComplete} 
        houseColor={theme.colors.primary}
      />
    ) : (
      <div className="py-6 text-center">
        <p className="text-gray-400 mb-4">Você ainda não tem metas para hoje.</p>
        <button 
          className="px-6 py-2 rounded-full transition-all hover:scale-105 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary}90 100%)`,
            color: theme.colors.background,
            boxShadow: `0 4px 10px ${theme.colors.primary}40, inset 0 1px 0 ${theme.colors.secondary}50`
          }}
        >
          Definir Metas
        </button>
      </div>
    )}
  </section>
);

// Cartão de Estatísticas do Usuário
const UserStatsCard = ({ theme, user, hasHouse }: { theme: any, user: any, hasHouse: boolean }) => (
  <section 
    className="backdrop-blur-sm rounded-xl p-6 transition-all"
    style={{ 
      background: `linear-gradient(160deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
      boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
      borderTop: `1px solid ${theme.colors.primary}30`
    }}
  >
    <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: theme.colors.primary }}>
      <span className="mr-2"></span>
      Atributos
    </h2>
    
    {user?.attributes ? (
      <UserStatsMin 
        stats={{
          health: user.attributes.health,
          physicalAttack: user.attributes.physicalAttack,
          specialAttack: user.attributes.specialAttack,
          physicalDefense: user.attributes.physicalDefense,
          specialDefense: user.attributes.specialDefense,
          speed: user.attributes.speed
        }} 
        theme={theme}
        attributePointsToDistribute={user.attributePointsToDistribute || 0}
      />
    ) : (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-3 rounded w-2/3" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
        <div className="h-3 rounded w-1/2" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
        <div className="h-3 rounded w-3/4" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
      </div>
    )}
  </section>
);

// Cartão de Feed de Atividades
const ActivityFeedCard = ({ theme, activities, hasHouse }: { 
  theme: any, 
  activities: Activity[], 
  hasHouse: boolean 
}) => (
  <section 
    className="backdrop-blur-sm rounded-xl p-6 transition-all"
    style={{ 
      background: `linear-gradient(160deg, ${theme.colors.background}85 0%, ${theme.colors.background}95 100%)`,
      boxShadow: `0 10px 30px ${theme.colors.primary}10, inset 0 1px 0 ${theme.colors.primary}30`,
      borderBottom: hasHouse ? `4px solid ${theme.colors.primary}` : 'none'
    }}
  >
    <h2 
      className="text-xl font-bold mb-6 flex items-center"
      style={{ color: theme.colors.primary }}
    >
      <span className="mr-2"></span>
      Atividades
    </h2>
    <ActivityFeed activities={activities} theme={theme} />
  </section>
); 