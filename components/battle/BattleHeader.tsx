import React from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaClock } from 'react-icons/fa';

interface BattleHeaderProps {
  currentTurn: number;
  timeLeft: number;
  phase: 'selection' | 'animation' | 'result';
}

const BattleHeader: React.FC<BattleHeaderProps> = ({ currentTurn, timeLeft, phase }) => {
  const { theme } = useHouseTheme();
  const router = useRouter();
  
  return (
    <header className="mb-6 p-4 rounded-lg flex items-center justify-between" 
      style={{ backgroundColor: theme.colors.background }}>
      <div className="flex items-center">
        <button
          onClick={() => router.push('/battle')}
          className="p-2 rounded-full mr-4 flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <FaChevronLeft color={theme.colors.text} />
        </button>
        
        <div>
          <h1 
            className="text-lg font-bold"
            style={{ color: theme.colors.primary }}
          >
            Batalha
          </h1>
          <p className="text-sm" style={{ color: theme.colors.text }}>
            Turno {currentTurn}
          </p>
        </div>
      </div>
      
      {phase === 'selection' && (
        <div 
          className="flex items-center px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: timeLeft <= 10 
              ? '#F44336' // vermelho 
              : (timeLeft <= 20 ? '#FF9800' : theme.colors.primary) // laranja : cor primária
          }}
        >
          <FaClock className="mr-2" color={theme.colors.text} />
          <span style={{ color: theme.colors.text }}>{timeLeft}s</span>
        </div>
      )}
      
      {phase === 'animation' && (
        <div 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: theme.colors.secondary }}
        >
          <span style={{ color: theme.colors.text }}>Processando...</span>
        </div>
      )}
      
      {phase === 'result' && (
        <div 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: theme.colors.accent }}
        >
          <span style={{ color: theme.colors.text }}>Resultados</span>
        </div>
      )}
    </header>
  );
};

export default BattleHeader; 