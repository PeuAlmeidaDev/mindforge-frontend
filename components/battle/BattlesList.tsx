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
        setBattles(data.data);
      } else {
        throw new Error(data.message || 'Erro ao carregar batalhas');
      }
    } catch (error) {
      console.error('Erro ao buscar batalhas:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar batalhas');
      
      // Dados de exemplo para desenvolvimento
      const mockBattles: BattleListItem[] = [
        {
          id: 'battle-123',
          currentTurn: 2,
          isFinished: false,
          winnerId: null,
          startedAt: new Date().toISOString(),
          participants: [
            { 
              id: 'participant-1', 
              participantType: 'player', 
              userId: user?.id || 'user-1',
              currentHealth: 100,
              user: { 
                id: user?.id || 'user-1', 
                username: 'Você', 
                level: 5 
              }, 
              enemy: null 
            },
            { 
              id: 'participant-2', 
              participantType: 'enemy',
              currentHealth: 100,
              user: null, 
              enemy: { 
                name: 'Dragão de Fogo', 
                imageUrl: '/placeholder.png', 
                rarity: 'rare' 
              } 
            }
          ]
        },
        {
          id: 'battle-456',
          currentTurn: 5,
          isFinished: true,
          winnerId: user?.id || 'user-1',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          participants: [
            { 
              id: 'participant-3', 
              participantType: 'player',
              userId: user?.id || 'user-1',
              currentHealth: 75,
              user: { 
                id: user?.id || 'user-1', 
                username: 'Você', 
                level: 5 
              }, 
              enemy: null 
            },
            { 
              id: 'participant-4', 
              participantType: 'enemy',
              currentHealth: 0,
              user: null, 
              enemy: { 
                name: 'Golem de Pedra', 
                imageUrl: '/placeholder.png', 
                rarity: 'common' 
              } 
            }
          ]
        }
      ];
      
      setBattles(mockBattles);
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

    // Caso 1: WinnerId definido - simplesmente comparamos com o ID do usuário
    if (battle.winnerId) {
      if (battle.winnerId === user.id) {
        return { label: 'Vitória', icon: <FaCheckCircle className="text-green-500" /> };
      } else {
        return { label: 'Derrota', icon: <FaSkull className="text-red-500" /> };
      }
    }

    // Caso 2: WinnerId não definido - verificamos estado dos participantes
    const userParticipant = battle.participants.find(p => 
      (p.participantType === 'user' || p.participantType === 'player') && 
      (p.userId === user.id || (p.user && p.user.id === user.id))
    );
    
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
        {battles.map((battle) => {
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
                </div>
                <h3 className="font-medium" style={{ color: theme.colors.primary }}>
                  VS {getOpponentName(battle)}
                </h3>
                <div className="flex items-center mt-1 text-sm" style={{ color: theme.colors.text }}>
                  <FaClock className="mr-1" />
                  <span>{formatDate(battle.startedAt)}</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push(`/battle/${battle.id}`)}
                className="p-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: !battle.isFinished ? theme.colors.primary : theme.colors.secondary }}
                disabled={battle.isFinished}
              >
                <FaArrowRight color={theme.colors.text} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BattlesList; 