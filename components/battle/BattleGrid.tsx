import React from 'react';
import useHouseTheme from '../../hooks/useHouseTheme';
import { motion } from 'framer-motion';
import ParticipantCard from './ParticipantCard';
import { FaCheck, FaCrosshairs } from 'react-icons/fa';

// Tipos para os participantes da batalha
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

interface BattleGridProps {
  playerTeam: BattleParticipant[];
  enemyTeam: BattleParticipant[];
  selectedSkill: string | null;
  selectedTarget: string | null;
  turnPhase: 'selection' | 'animation' | 'result';
  onTargetSelect: (targetId: string) => void;
  activeParticipant?: string;
}

const BattleGrid: React.FC<BattleGridProps> = ({
  playerTeam,
  enemyTeam,
  selectedSkill,
  selectedTarget,
  turnPhase,
  onTargetSelect,
  activeParticipant
}) => {
  const { theme } = useHouseTheme();
  
  const gridItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    active: { scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' },
    target: { scale: 1.1, boxShadow: `0 0 20px ${theme.colors.primary}` }
  };

  return (
    <div className="battle-grid-container mb-8">
      {/* Seção Inimiga */}
      <div className="battle-grid-enemies mb-8">
        <h3 className="text-lg font-medium mb-4"
          style={{ color: theme.colors.secondary }}>
          Inimigos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {enemyTeam.map((enemy, index) => (
            <motion.div
              key={enemy.id}
              className="relative"
              initial="initial"
              animate="animate"
              whileHover={turnPhase === 'selection' && selectedSkill ? "hover" : undefined}
              variants={gridItemVariants}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ParticipantCard
                participant={enemy}
                isSelectable={turnPhase === 'selection' && selectedSkill !== null}
                isSelected={selectedTarget === enemy.id}
                isActive={activeParticipant === enemy.id}
                onSelect={() => onTargetSelect(enemy.id)}
              />
              
              {selectedTarget === enemy.id && turnPhase === 'selection' && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-red-600 rounded-full p-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <FaCrosshairs className="text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Divisor da Arena */}
      <div 
        className="h-1 w-full rounded-full mb-8"
        style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}
      />
      
      {/* Seção do Jogador */}
      <div className="battle-grid-players">
        <h3 className="text-lg font-medium mb-4"
          style={{ color: theme.colors.primary }}>
          Seu Time
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playerTeam.map((player, index) => (
            <motion.div
              key={player.id}
              className="relative"
              initial="initial"
              animate="animate"
              variants={gridItemVariants}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ParticipantCard
                participant={player}
                isSelectable={false}
                isSelected={false}
                isActive={activeParticipant === player.id}
              />
              
              {activeParticipant === player.id && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-green-600 rounded-full p-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <FaCheck className="text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleGrid; 