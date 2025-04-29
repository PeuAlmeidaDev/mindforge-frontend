import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useHouseTheme from '../../hooks/useHouseTheme';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaBolt, FaHeart, FaFire, FaTint, FaLeaf, FaStar } from 'react-icons/fa';
import ElementalTypeIcon from '../ElementalTypeIcon';

interface Participant {
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
  user?: {
    id: string;
    username: string;
    profileImageUrl?: string;
    primaryElementalType: string;
    secondaryElementalType?: string | null;
    level: number;
    attributes?: {
      health: number;
      physicalAttack: number;
      specialAttack: number;
      physicalDefense: number;
      specialDefense: number;
      speed: number;
    };
  } | null;
  enemy?: {
    id: string;
    name: string;
    imageUrl: string;
    elementalType: string;
    rarity: string;
    isBoss: boolean;
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
  } | null;
  statusEffects: any[];
  buffs: any[];
  debuffs: any[];
}

interface ParticipantCardProps {
  participant: Participant;
  isPlayerTeam?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ 
  participant, 
  isPlayerTeam = false,
  isSelectable = false,
  isSelected = false,
  isActive = false,
  onClick,
  onSelect
}) => {
  const { theme } = useHouseTheme();

  const [enemyName, setEnemyName] = useState<string>()
  const [enemyElementalType, setEnemyElementalType] = useState<string>()
  const [enemyRarity, setEnemyRarity] = useState<string>()
  const [isBoss, setIsBoss] = useState<boolean>(false)

  const [playerName, setPlayerName] = useState<string>()
  const [playerLevel, setPlayerLevel] = useState<number>()
  const [playerElementalType, setPlayerElementalType] = useState<string>()
  const [playerSecondaryElementalType, setPlayerSecondaryElementalType] = useState<string | null>()

  useEffect(() => {
    if(participant.enemy){
      setEnemyName(participant.enemy.name)
      setEnemyElementalType(participant.enemy.elementalType)
      setEnemyRarity(participant.enemy.rarity)
      setIsBoss(participant.enemy.isBoss)
    }

    if(participant.user){
      setPlayerName(participant.user.username)
      setPlayerLevel(participant.user.level)
      setPlayerElementalType(participant.user.primaryElementalType)
      setPlayerSecondaryElementalType(participant.user.secondaryElementalType || null)
    }
  },[participant])
  
  const name = playerName || enemyName || 'Desconhecido';
  const elementalType = playerElementalType || enemyElementalType || 'NORMAL';
  const secondaryElementalType = playerSecondaryElementalType || null;
  const level = playerLevel || 1;
  const imageUrl = participant.user?.profileImageUrl || participant.enemy?.imageUrl || '/placeholder.png';
  
  // Calcular porcentagem de HP
  const maxHealth = participant.maxHealth || 
                   (participant.user?.attributes?.health || 
                    participant.enemy?.health || 100);
  const healthPercentage = Math.max(0, Math.min(100, (participant.currentHealth / maxHealth) * 100));
  
  // Determinar cor da barra de vida
  const getHealthColor = () => {
    if (healthPercentage <= 20) return '#F44336'; // Vermelho
    if (healthPercentage <= 50) return '#FF9800'; // Laranja
    return '#4CAF50'; // Verde
  };
  
  // Animação ao selecionar
  const cardVariants = {
    normal: { scale: 1 },
    selected: { scale: 1.05, boxShadow: '0 0 10px rgba(255,255,255,0.5)' },
    active: { scale: 1.05, boxShadow: `0 0 15px ${theme.colors.primary}` }
  };
  
  const handleClick = () => {
    if (isSelectable) {
      if (onSelect) {
        onSelect();
      } else if (onClick) {
        onClick();
      }
    }
  };

  // Determinar as classes do anel de destaque
  const ringClasses = () => {
    if (isActive) {
      return 'ring-2 ring-offset-2 ring-primary';
    }
    if (isSelected) {
      return 'ring-2 ring-secondary';
    }
    return '';
  };

  // Renderizar ícones para inimigos com base em sua raridade ou status de chefe
  const getRarityIcons = () => {
    if (isBoss) {
      return (
        <div className="absolute -top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          BOSS
        </div>
      );
    }
    
    if (enemyRarity) {
      const stars = {
        'COMMON': 1,
        'UNCOMMON': 2,
        'RARE': 3,
        'EPIC': 4,
        'LEGENDARY': 5
      }[enemyRarity] || 1;
      
      return (
        <div className="absolute -top-2 left-2 flex">
          {[...Array(stars)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
        </div>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="normal"
      animate={isActive ? 'active' : (isSelected ? 'selected' : 'normal')}
      onClick={handleClick}
      className={`relative p-4 rounded-lg ${isSelectable ? 'cursor-pointer' : ''} ${ringClasses()}`}
      style={{ 
        backgroundColor: theme.colors.background,
        boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
        borderColor: isSelected ? theme.colors.primary : 'transparent'
      }}
    >
      {/* Raridade para inimigos */}
      {participant.enemy && getRarityIcons()}
      
      {/* Status Effects, Buffs, Debuffs */}
      {((participant.statusEffects?.length || 0) > 0 || (participant.buffs?.length || 0) > 0 || (participant.debuffs?.length || 0) > 0) && (
        <div className="absolute -top-2 right-2 flex space-x-1">
          {participant.statusEffects?.map((effect, index) => (
            <div 
              key={`status-${index}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: '#F44336' }}
              title={effect.name}
            >
              <FaFire color="#fff" />
            </div>
          ))}
          
          {participant.buffs?.map((buff, index) => (
            <div 
              key={`buff-${index}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: '#4CAF50' }}
              title={buff.name}
            >
              <FaBolt color="#fff" />
            </div>
          ))}
          
          {participant.debuffs?.map((debuff, index) => (
            <div 
              key={`debuff-${index}`}
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ backgroundColor: '#FF9800' }}
              title={debuff.name}
            >
              <FaShieldAlt color="#fff" />
            </div>
          ))}
        </div>
      )}
      
      {/* Avatar e Info */}
      <div className="flex items-center mb-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-300 mr-3">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: 'cover' }}
              priority={false}
            />
          )}
        </div>
        
        <div>
          <h3 
            className="font-medium text-lg"
            style={{ color: isPlayerTeam ? theme.colors.primary : theme.colors.secondary }}
          >
            {name}
          </h3>
          
          <div className="flex items-center">
            <ElementalTypeIcon type={elementalType} size={18} />
            {secondaryElementalType && (
              <ElementalTypeIcon type={secondaryElementalType} size={18} className="ml-1" />
            )}
            <span 
              className="ml-1 text-sm"
              style={{ color: theme.colors.text }}
            >
              Nv. {level}
            </span>
          </div>
        </div>
      </div>
      
      {/* Barra de Vida */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="flex items-center" style={{ color: theme.colors.text }}>
            <FaHeart className="mr-1" color={getHealthColor()} />
            HP
          </span>
          <span style={{ color: theme.colors.text }}>
            {participant.currentHealth}/{maxHealth}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full"
            style={{ 
              width: `${healthPercentage}%`,
              backgroundColor: getHealthColor(),
              transition: 'width 0.5s ease-out, background-color 0.5s ease-out'
            }}
          ></div>
        </div>
      </div>
      
      {/* Atributos */}
      <div className="grid grid-cols-2 gap-2">
        <div 
          className="text-xs flex items-center"
          style={{ color: theme.colors.text }}
        >
          <FaBolt className="mr-1" color="#FFC107" />
          ATK: {participant.currentPhysicalAttack}
        </div>
        
        <div 
          className="text-xs flex items-center"
          style={{ color: theme.colors.text }}
        >
          <FaTint className="mr-1" color="#2196F3" />
          SP.ATK: {participant.currentSpecialAttack}
        </div>
        
        <div 
          className="text-xs flex items-center"
          style={{ color: theme.colors.text }}
        >
          <FaShieldAlt className="mr-1" color="#4CAF50" />
          DEF: {participant.currentPhysicalDefense}
        </div>
        
        <div 
          className="text-xs flex items-center"
          style={{ color: theme.colors.text }}
        >
          <FaLeaf className="mr-1" color="#9C27B0" />
          SP.DEF: {participant.currentSpecialDefense}
        </div>
      </div>
    </motion.div>
  );
};

export default ParticipantCard; 