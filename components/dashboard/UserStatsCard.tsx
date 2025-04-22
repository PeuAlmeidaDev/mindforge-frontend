import React from 'react';
import { motion } from 'framer-motion';
import UserStats from './UserStats';

interface UserStatsCardProps {
  theme: any;
  user: any;
  hasHouse: boolean;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ 
  theme, 
  user, 
  hasHouse 
}) => {
  // Obter estatísticas do usuário (mock ou do objeto user)
  const mockStats = {
    health: 100, // Agora usando o valor real, sem multiplicação
    physicalAttack: 15,
    specialAttack: 18,
    physicalDefense: 12,
    specialDefense: 14,
    speed: 16
  };
  
  // Usar estatísticas reais do usuário se disponíveis, ou então usar estatísticas mockadas
  let stats;
  if (user?.attributes) {
    stats = {
      health: user.attributes.health,
      physicalAttack: user.attributes.physicalAttack,
      specialAttack: user.attributes.specialAttack,
      physicalDefense: user.attributes.physicalDefense,
      specialDefense: user.attributes.specialDefense,
      speed: user.attributes.speed
    };
  } else {
    stats = mockStats;
  }

  return (
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
      
      {user ? (
        <UserStats 
          stats={stats}
          theme={theme}
          attributePointsToDistribute={user.attributePointsToDistribute || 0}
          variant="minimal"
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
};

export default UserStatsCard; 