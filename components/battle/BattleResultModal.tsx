import React from 'react';
import useHouseTheme from '../../hooks/useHouseTheme';
import { motion } from 'framer-motion';
import { FaTrophy, FaArrowUp, FaStar, FaTimes } from 'react-icons/fa';

interface BattleResult {
  victory: boolean;
  experienceGained: number;
  levelUp: boolean;
  skillsUnlocked?: {
    id: string;
    name: string;
    elementalType: string;
  }[];
}

interface BattleResultModalProps {
  result: BattleResult;
  onClose: () => void;
}

const BattleResultModal: React.FC<BattleResultModalProps> = ({ result, onClose }) => {
  const { theme } = useHouseTheme();
  
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { delay: 0.2, type: 'spring', stiffness: 300, damping: 25 }
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      initial="hidden"
      animate="visible"
      variants={overlayVariants}
    >
      <motion.div
        className="relative max-w-md w-full rounded-lg p-6"
        style={{ backgroundColor: theme.colors.background }}
        variants={modalVariants}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full"
          style={{ color: theme.colors.text }}
        >
          <FaTimes />
        </button>
        
        <div className="text-center mb-6">
          {result.victory ? (
            <>
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2 }}
              >
                <FaTrophy size={50} color={theme.colors.text} />
              </motion.div>
              <h2 
                className="text-2xl font-bold mb-1"
                style={{ color: theme.colors.primary }}
              >
                Vitória!
              </h2>
              <p className="text-sm" style={{ color: theme.colors.text }}>
                Você venceu a batalha!
              </p>
            </>
          ) : (
            <>
              <motion.div
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#F44336' }}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
              >
                <FaTimes size={50} color={theme.colors.text} />
              </motion.div>
              <h2 
                className="text-2xl font-bold mb-1"
                style={{ color: '#F44336' }}
              >
                Derrota
              </h2>
              <p className="text-sm" style={{ color: theme.colors.text }}>
                Você perdeu a batalha, mas ganhou experiência!
              </p>
            </>
          )}
        </div>
        
        <div 
          className="rounded-lg p-4 mb-4"
          style={{ backgroundColor: theme.colors.backgroundDark }}
        >
          <h3 
            className="text-lg font-medium mb-3"
            style={{ color: theme.colors.primary }}
          >
            Recompensas
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaStar className="mr-2" color="#FFC107" />
                <span style={{ color: theme.colors.text }}>Experiência</span>
              </div>
              <span 
                className="font-bold"
                style={{ color: theme.colors.secondary }}
              >
                +{result.experienceGained} XP
              </span>
            </div>
            
            {result.levelUp && (
              <div 
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: theme.colors.primary + '33' }} // 20% opacity
              >
                <div className="flex items-center">
                  <FaArrowUp className="mr-2" color={theme.colors.primary} />
                  <span style={{ color: theme.colors.primary }}>Nível Aumentado!</span>
                </div>
                <span 
                  className="font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  +3 Pontos de Atributo
                </span>
              </div>
            )}
            
            {result.skillsUnlocked && result.skillsUnlocked.length > 0 && (
              <div className="mt-4">
                <h4 
                  className="text-sm font-medium mb-2"
                  style={{ color: theme.colors.secondary }}
                >
                  Novas Habilidades Desbloqueadas:
                </h4>
                <div className="space-y-2">
                  {result.skillsUnlocked.map(skill => (
                    <div 
                      key={skill.id}
                      className="p-2 rounded flex items-center"
                      style={{ backgroundColor: theme.colors.primary + '33' }} // 20% opacity
                    >
                      <div 
                        className="w-6 h-6 rounded-full mr-2 flex items-center justify-center"
                        style={{ backgroundColor: theme.colors.primary }}
                      >
                        <FaStar color={theme.colors.text} size={10} />
                      </div>
                      <span style={{ color: theme.colors.text }}>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-medium"
          style={{ 
            backgroundColor: theme.colors.primary,
            color: theme.colors.text
          }}
        >
          Voltar para o Menu
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BattleResultModal; 