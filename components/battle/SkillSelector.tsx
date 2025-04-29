import React from 'react';
import useHouseTheme from '../../hooks/useHouseTheme';
import { motion } from 'framer-motion';
import ElementalTypeIcon from '../ElementalTypeIcon';

interface Skill {
  id: string;
  name: string;
  elementalType: string;
  power: number;
  accuracy: number;
  description: string;
  targetType: 'single' | 'all';
}

interface SkillSelectorProps {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({ skill, isSelected, onClick }) => {
  const { theme } = useHouseTheme();
  
  const getElementalColor = (type: string) => {
    const colors: Record<string, string> = {
      FIRE: '#FF5722',
      WATER: '#2196F3',
      EARTH: '#795548',
      AIR: '#00BCD4',
      LIGHT: '#FFEB3B',
      DARK: '#673AB7',
      NORMAL: '#9E9E9E',
      POISON: '#8BC34A',
      ELECTRIC: '#FFC107',
      ICE: '#03A9F4',
      PSYCHIC: '#E91E63',
      GHOST: '#9C27B0',
      DRAGON: '#FF9800',
      FAIRY: '#F48FB1'
    };
    
    return colors[type] || '#9E9E9E'; // Cor padrão para tipos desconhecidos
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer border-2 ${
        isSelected ? 'border-opacity-100' : 'border-opacity-30'
      }`}
      style={{ 
        backgroundColor: theme.colors.background,
        borderColor: getElementalColor(skill.elementalType),
        boxShadow: isSelected 
          ? `0 0 8px ${getElementalColor(skill.elementalType)}` 
          : 'none'
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span 
            className="font-medium text-sm"
            style={{ color: theme.colors.primary }}
          >
            {skill.name}
          </span>
          <ElementalTypeIcon type={skill.elementalType} size={14} />
        </div>
        
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: theme.colors.text }}>
            Poder: {skill.power}
          </span>
          <span style={{ color: theme.colors.text }}>
            Acc: {skill.accuracy}%
          </span>
        </div>
        
        <div 
          className="text-xs mt-1"
          style={{ color: theme.colors.text }}
        >
          <span className="block truncate" title={skill.description}>
            {skill.description.length > 20
              ? skill.description.substring(0, 20) + '...'
              : skill.description}
          </span>
        </div>
        
        <div 
          className="text-xs mt-1 px-1 rounded text-center"
          style={{ 
            backgroundColor: getElementalColor(skill.elementalType),
            color: '#fff'
          }}
        >
          {skill.targetType === 'all' ? 'Todos' : 'Único'}
        </div>
      </div>
    </motion.div>
  );
};

export default SkillSelector; 