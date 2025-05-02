import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import BattleArena from '../../components/battle/BattleArena';
import HeaderSection from '../../components/dashboard/HeaderSection';
import { motion } from 'framer-motion';

// Definição de tipos para a batalha
interface BattleParticipant {
  id: string;
  participantType: string;
  teamId: string;
  position: number;
  currentHealth: number;
  maxHealth?: number;
  currentPhysicalAttack: number;
  currentSpecialAttack: number;
  currentPhysicalDefense: number;
  currentSpecialDefense: number;
  currentSpeed: number;
  userId?: string;
  enemyId?: string;
  user?: {
    id: string;
    username: string;
    profileImageUrl?: string;
    primaryElementalType: string;
    level: number;
  };
  enemy?: {
    id: string;
    name: string;
    imageUrl: string;
    elementalType: string;
    rarity: string;
    isBoss: boolean;
  };
  statusEffects: any[];
  buffs: any[];
  debuffs: any[];
}

interface BattleData {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt?: string;
  participants: BattleParticipant[];
}

const BattleDetailsPage: NextPage = () => {
  const { theme } = useHouseTheme();
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [battleData, setBattleData] = useState<BattleData | null>(null);
  const [error, setError] = useState('');

  // Informações baseadas no usuário
  const houseId = user?.house?.id || '';
  const hasHouse = Boolean(user && user.house && user.house.name);
  const houseName = user?.house?.name || 'Sem Casa';

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Carregar dados da batalha quando o ID estiver disponível
  useEffect(() => {
    if (id && user && token) {
      setLoading(true);
      
      console.log('Carregando dados da batalha:', id);
      
      // Chamada à API para obter detalhes da batalha
      fetch(`http://localhost:3000/api/battles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Batalha não encontrada ou você não tem permissão para acessá-la');
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setBattleData(data.data);
          } else {
            setError(data.message || 'Ocorreu um erro ao carregar a batalha');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Ocorreu um erro ao carregar a batalha');
          setLoading(false);
        });
    }
  }, [id, user, token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.backgroundDark }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}></div>
          <p style={{ color: theme.colors.text }}>Carregando...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.backgroundDark }}>
        <HeaderSection 
          theme={theme} 
          user={user} 
          houseName={houseName} 
          hasHouse={hasHouse} 
          houseId={houseId}
        />
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center p-6 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
            <h2 className="text-xl mb-4" style={{ color: theme.colors.primary }}>Erro</h2>
            <p style={{ color: theme.colors.text }}>{error}</p>
            <button 
              className="mt-4 px-4 py-2 rounded-md"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text
              }}
              onClick={() => router.push('/battle')}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: theme.colors.backgroundDark }}>
        <HeaderSection 
          theme={theme} 
          user={user} 
          houseName={houseName} 
          hasHouse={hasHouse} 
          houseId={houseId}
        />
        <div className="container mx-auto px-4 py-6 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: theme.colors.primary }}></div>
            <p style={{ color: theme.colors.text }}>Carregando batalha...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.backgroundDark }}>
      <HeaderSection 
        theme={theme} 
        user={user} 
        houseName={houseName} 
        hasHouse={hasHouse} 
        houseId={houseId}
      />
      {battleData && <BattleArena battle={battleData} />}
    </div>
  );
};

export default BattleDetailsPage; 