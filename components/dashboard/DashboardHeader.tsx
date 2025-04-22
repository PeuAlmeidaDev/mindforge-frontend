import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useHouseTheme from '../../hooks/useHouseTheme';
import ElementalTypeIcon from '../ElementalTypeIcon';

interface DashboardHeaderProps {
  name: string;
  level: number;
  elementalType: string;
  house: string;
  houseColor: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  name, 
  level, 
  elementalType, 
  house,
  houseColor
}) => {
  const { theme } = useHouseTheme();
  const [elementColor, setElementColor] = useState('#cccccc');
  const [elementTypeDisplay, setElementTypeDisplay] = useState('');
  
  // Definir cores com base no tipo elemental
  useEffect(() => {
    // Mapear o tipo elemental do backend para o formato de exibição
    let displayType = 'normal';
    
    switch (elementalType.toUpperCase()) {
      case 'FIRE':
        setElementColor('#FF4500');
        displayType = 'fogo';
        break;
      case 'WATER':
        setElementColor('#1E90FF');
        displayType = 'água';
        break;
      case 'EARTH':
        setElementColor('#228B22');
        displayType = 'terra';
        break;
      case 'AIR':
        setElementColor('#87CEEB');
        displayType = 'ar';
        break;
      case 'ICE':
        setElementColor('#ADD8E6');
        displayType = 'gelo';
        break;
      case 'ELECTRIC':
        setElementColor('#FFD700');
        displayType = 'elétrico';
        break;
      case 'DARK':
        setElementColor('#800080');
        displayType = 'sombra';
        break;
      case 'LIGHT':
        setElementColor('#FFFACD');
        displayType = 'luz';
        break;
      case 'NORMAL':
        setElementColor('#A8A878');
        displayType = 'natureza';
        break;
      case 'PSYCHIC':
        setElementColor('#F85888');
        displayType = 'psíquico';
        break;
      case 'GHOST':
        setElementColor('#705898');
        displayType = 'fantasma';
        break;
      case 'FAIRY':
        setElementColor('#B8B8D0');
        displayType = 'aço';
        break;
      case 'POISON':
        setElementColor('#A040A0');
        displayType = 'veneno';
        break;
      case 'DRAGON':
        setElementColor('#7038F8');
        displayType = 'voador';
        break;
      default:
        setElementColor('#CCCCCC');
        displayType = 'pedra';
    }
    
    setElementTypeDisplay(displayType);
  }, [elementalType]);
  
  // Obter a inicial do nome do usuário
  const getInitial = () => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <header className="relative">
      {/* Gradiente de fundo do cabeçalho */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          height: '200%',
          background: `linear-gradient(to bottom, ${theme.colors.backgroundDark} 10%, transparent 100%)`
        }}
      />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-wrap items-center justify-between">
          {/* Informações do usuário */}
          <div className="flex items-center space-x-4">
            {/* Avatar do usuário com borda baseada no elemento */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div 
                className="rounded-full p-1" 
                style={{ 
                  background: `linear-gradient(45deg, ${elementColor}, ${theme.colors.primary})`,
                  boxShadow: `0 0 15px ${elementColor}40`
                }}
              >
                <div 
                  className="rounded-full p-0.5"
                  style={{ backgroundColor: theme.colors.backgroundDark }}
                >
                  <div 
                    className="rounded-full w-16 h-16 flex items-center justify-center overflow-hidden"
                    style={{ 
                      backgroundColor: `${theme.colors.background}`,
                      color: elementColor
                    }}
                  >
                    <span className="text-2xl font-bold">{getInitial()}</span>
                  </div>
                </div>
              </div>
              
              {/* Ícone de tipo elemental */}
              <div 
                className="absolute -bottom-1 -right-1 rounded-full w-7 h-7 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(45deg, ${elementColor}, ${theme.colors.primary})`,
                  boxShadow: `0 0 10px ${elementColor}60`
                }}
              >
                <ElementalTypeIcon type={elementTypeDisplay} size={20} />
              </div>
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xl font-bold"
                style={{ color: theme.colors.text }}
              >
                {name}
              </motion.h1>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center space-x-2 text-sm"
              >
                <span 
                  className="text-xs px-2 py-0.5 rounded-full" 
                  style={{ backgroundColor: elementColor }}
                >
                  {elementTypeDisplay}
                </span>
                <span style={{ color: `${theme.colors.text}80` }}>Casa: {house}</span>
              </motion.div>
            </div>
          </div>
          
          {/* Nível do usuário */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 sm:mt-0"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="rounded-lg px-3 py-1 flex items-center space-x-2"
                style={{ backgroundColor: `${theme.colors.backgroundDark}` }}
              >
                <span className="text-yellow-400 text-2xl">⭐</span>
                <div>
                  <span className="text-xs" style={{ color: `${theme.colors.text}60` }}>NÍVEL</span>
                  <p className="font-bold" style={{ color: theme.colors.text }}>{level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 