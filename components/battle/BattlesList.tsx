import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHourglassHalf, FaCheckCircle, FaClock, FaSkull } from 'react-icons/fa';

interface BattleParticipant {
  id: string;
  participantType?: string;
  userId?: string | null;
  currentHealth?: number;
  user?: {
    id: string;
    username: string;
    level: number;
  } | null;
  enemy?: {
    name: string;
    imageUrl: string;
    rarity: string;
  } | null;
}

interface BattleListItem {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  participants: BattleParticipant[];
}

const BattlesList: React.FC = () => {
  const { theme } = useHouseTheme();
  const { user, token } = useAuth();
  const router = useRouter();
  const [battles, setBattles] = useState<BattleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    if (token) {
      fetchBattles();
    }
  }, [token]);

  const fetchBattles = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/battles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Não foi possível carregar suas batalhas');
      }

      const data = await response.json();
      
      if (data.success) {
        // Ordena as batalhas pela data mais recente primeiro
        const sortedBattles = data.data.sort((a: BattleListItem, b: BattleListItem) => {
          return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
        });
        setBattles(sortedBattles);
      } else {
        throw new Error(data.message || 'Erro ao carregar batalhas');
      }
    } catch (error) {
      console.error('Erro ao buscar batalhas:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar batalhas');
      
      // Removendo dados de exemplo
      setBattles([]);
    } finally {
      setLoading(false);
    }
  };

  const getBattleStatus = (battle: BattleListItem) => {
    // Se a batalha não estiver finalizada, ela está em andamento
    if (!battle.isFinished) {
      return { label: 'Em andamento', icon: <FaHourglassHalf className="text-yellow-500" /> };
    }

    if (!user?.id) {
      return { label: 'Indeterminado', icon: <FaHourglassHalf className="text-yellow-500" /> };
    }

    // Encontra o participante do usuário
    const userParticipant = battle.participants.find(p => 
      (p.participantType === 'user' || p.participantType === 'player') && 
      (p.userId === user.id || (p.user && p.user.id === user.id))
    );
    
    // Se não encontrarmos o participante do usuário, não podemos determinar
    if (!userParticipant) {
      return { label: 'Indeterminado', icon: <FaHourglassHalf className="text-yellow-500" /> };
    }
    
    // Verifica se o ID do participante do usuário é o vencedor
    if (battle.winnerId) {
      if (battle.winnerId === userParticipant.id) {
        return { label: 'Vitória', icon: <FaCheckCircle className="text-green-500" /> };
      } else {
        return { label: 'Derrota', icon: <FaSkull className="text-red-500" /> };
      }
    }

    // Se winnerId não estiver definido, verificamos pelo estado de saúde
    const enemyParticipant = battle.participants.find(p => 
      p.participantType === 'enemy'
    );

    // Se temos tanto participante do usuário quanto inimigo
    if (userParticipant && enemyParticipant) {
      // Se o participante do usuário tiver currentHealth e o inimigo também
      if ('currentHealth' in userParticipant && 'currentHealth' in enemyParticipant) {
        const userHealth = userParticipant.currentHealth || 0;
        const enemyHealth = enemyParticipant.currentHealth || 0;
        
        // Usuário vivo e inimigo morto = vitória
        if (userHealth > 0 && enemyHealth <= 0) {
          return { label: 'Vitória', icon: <FaCheckCircle className="text-green-500" /> };
        } 
        // Usuário morto = derrota
        else if (userHealth <= 0) {
          return { label: 'Derrota', icon: <FaSkull className="text-red-500" /> };
        }
      }
    }
    
    // Se nenhuma das condições acima for atendida, não podemos determinar
    return { label: 'Indeterminado', icon: <FaHourglassHalf className="text-yellow-500" /> };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOpponentName = (battle: BattleListItem) => {
    const opponent = battle.participants.find(p => p.participantType === 'enemy');
    return opponent?.enemy?.name || 'Oponente desconhecido';
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="w-12 h-12 border-t-4 border-b-4 rounded-full animate-spin"
          style={{ borderColor: theme.colors.primary }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-12 p-6 rounded-lg" 
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <h3 className="text-xl mb-2" style={{ color: theme.colors.primary }}>Erro</h3>
        <p>{error}</p>
        <button
          onClick={fetchBattles}
          className="mt-4 px-4 py-2 rounded-md"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (battles.length === 0) {
    return (
      <div className="text-center my-12 p-6 rounded-lg" 
        style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
        <FaHourglassHalf size={40} className="mx-auto mb-4" style={{ color: theme.colors.primary }} />
        <h3 className="text-xl mb-2" style={{ color: theme.colors.primary }}>Nenhuma batalha encontrada</h3>
        <p>Você ainda não participou de nenhuma batalha. Crie uma nova batalha para começar!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
        Suas Batalhas
      </h2>
      
      <div className="space-y-4">
        {battles.slice(0, displayLimit).map((battle) => {
          const status = getBattleStatus(battle);
          
          return (
            <motion.div
              key={battle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: theme.colors.background }}
            >
              <div>
                <div className="flex items-center mb-1">
                  {status.icon}
                  <span className="ml-2" style={{ color: theme.colors.text }}>
                    {status.label}
                  </span>
                  {battle.isFinished && (
                    <span className="ml-3 px-2 py-0.5 text-xs rounded-full" style={{ 
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.text
                    }}>
                      Finalizada
                    </span>
                  )}
                </div>
                <h3 className="font-medium" style={{ color: theme.colors.primary }}>
                  VS {getOpponentName(battle)}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm" style={{ color: theme.colors.text }}>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    <span>{formatDate(battle.startedAt)}</span>
                  </div>
                  <div>
                    <span>Turno {battle.currentTurn}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => router.push(`/battle/${battle.id}`)}
                className="p-3 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  opacity: battle.isFinished ? 0.8 : 1
                }}
                title={battle.isFinished ? "Ver detalhes da batalha finalizada" : "Continuar batalha"}
              >
                <FaArrowRight color={theme.colors.text} />
              </button>
            </motion.div>
          );
        })}
      </div>
      
      {battles.length > displayLimit && (
        <div className="text-center mt-4">
          <button
            onClick={() => setDisplayLimit(prev => prev + 10)}
            className="px-4 py-2 rounded-md"
            style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text }}
          >
            Carregar mais
          </button>
        </div>
      )}
    </div>
  );
};

export default BattlesList; 