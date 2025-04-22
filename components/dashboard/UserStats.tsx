import { useState } from 'react';
import { motion } from 'framer-motion';
import useHouseTheme from '../../hooks/useHouseTheme';

interface UserStatsProps {
  stats: {
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
  };
  theme?: any;
  elegantMode?: boolean;
  attributePointsToDistribute?: number;
  variant?: 'default' | 'minimal' | 'alternative';
}

const UserStats = ({ 
  stats, 
  theme: propTheme, 
  elegantMode = false, 
  attributePointsToDistribute = 0,
  variant = 'default'
}: UserStatsProps) => {
  const { theme: hookTheme } = useHouseTheme();
  // Usar o tema fornecido nas props ou o do hook
  const theme = propTheme || hookTheme;
  
  // Calcular o poder de batalha como a soma de todos os atributos
  const totalValue = 
    stats.health + 
    stats.physicalAttack + 
    stats.specialAttack + 
    stats.physicalDefense + 
    stats.specialDefense + 
    stats.speed;
  
  return (
    <div className="space-y-6">
      {/* Visão geral dos atributos */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm" style={{ color: `${theme.colors.text}90` }}>
            Poder de Batalha
          </div>
          <div className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
            {totalValue}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {attributePointsToDistribute > 0 && (
            <div 
              className="text-center px-3 py-2 rounded-md backdrop-blur-sm" 
              style={{ 
                backgroundColor: `${theme.colors.backgroundDark}80`,
                border: `1px solid ${theme.colors.primary}30`
              }}
            >
              <div className="text-xs" style={{ color: `${theme.colors.text}80` }}>Pontos</div>
              <div className="font-semibold" style={{ color: theme.colors.text }}>{attributePointsToDistribute}</div>
            </div>
          )}
          
          <div 
            className="text-center px-3 py-2 rounded-md backdrop-blur-sm" 
            style={{ 
              backgroundColor: `${theme.colors.backgroundDark}80`,
              border: `1px solid ${theme.colors.primary}30`
            }}
          >
            <div className="text-xs" style={{ color: `${theme.colors.text}80` }}>
              Rank
            </div>
            <div className="font-semibold" style={{ color: theme.colors.text }}>
              {totalValue < 100 ? 'D' : totalValue < 150 ? 'C' : totalValue < 200 ? 'B' : totalValue < 250 ? 'A' : 'S'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de atributos - simplificada */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center border-b border-gray-800 pb-2">
            <span 
              className="text-sm font-medium"
              style={{ color: theme.colors.text }}
            >
              {formatStatName(key)}
            </span>
            <span 
              className="text-sm font-semibold"
              style={{ color: theme.colors.primary }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Funções auxiliares
function formatStatName(stat: string): string {
  const formattedNames: Record<string, string> = {
    health: 'Vida',
    physicalAttack: 'Ataque Físico',
    specialAttack: 'Ataque Especial',
    physicalDefense: 'Defesa Física',
    specialDefense: 'Defesa Especial', 
    speed: 'Velocidade',
  };
  
  return formattedNames[stat] || stat;
}

function getStrongestStat(stats: UserStatsProps['stats']): string {
  const entries = Object.entries(stats);
  const [strongestStat] = entries.reduce((strongest, current) => {
    const [, strongestValue] = strongest;
    const [, currentValue] = current;
    return currentValue > strongestValue ? current : strongest;
  });
  
  return formatStatName(strongestStat);
}

export default UserStats; 