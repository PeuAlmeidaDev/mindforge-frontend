import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  FaBolt, 
  FaFire, 
  FaSkull, 
  FaArrowRight, 
  FaDice, 
  FaSpinner 
} from 'react-icons/fa';
import { API_ENDPOINTS } from '../../lib/config';

// Já que react-icons não tem FaSwords, vamos criar um componente personalizado
const FaSwords = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-6 h-6"
  >
    <path d="M14.5 14.5L11 18L9 16L12.5 12.5M15.88 9.15L18.5 6.54C19.72 5.31 19.95 3.5 18.95 2.5C17.95 1.5 16.13 1.73 14.91 2.94L12.3 5.56M10.56 8.62L8.45 10.72L3 5.28V7.75L7.28 12L2.96 16.3L4.03 17.37L8.33 13.04L12.62 17.33L14.73 15.23M6.4 19.8L8.5 17.7L7.4 16.55L5.3 18.6L6.4 19.8Z" />
  </svg>
);

interface DifficultyOption {
  id: 'easy' | 'normal' | 'hard';
  label: string;
  description: string;
  icon: JSX.Element;
  aiLevel: number;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    id: 'easy',
    label: 'Fácil',
    description: '1 inimigo comum. Recomendado para iniciantes.',
    icon: <FaBolt className="text-yellow-500" size={24} />,
    aiLevel: 1
  },
  {
    id: 'normal',
    label: 'Normal',
    description: '2 inimigos, comuns e incomuns. Um bom desafio.',
    icon: <FaFire className="text-orange-500" size={24} />,
    aiLevel: 3
  },
  {
    id: 'hard',
    label: 'Difícil',
    description: '3 inimigos, incluindo raros. Prepare-se bem!',
    icon: <FaSkull className="text-red-500" size={24} />,
    aiLevel: 5
  }
];

const DifficultySelector: React.FC = () => {
  const { theme } = useHouseTheme();
  const { token } = useAuth();
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'normal' | 'hard' | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  const startBattle = async () => {
    if (!selectedDifficulty) return;

    setIsStarting(true);
    setError('');

    try {
      const difficulty = DIFFICULTY_OPTIONS.find(d => d.id === selectedDifficulty);
      
      if (!difficulty) {
        throw new Error('Dificuldade inválida selecionada');
      }

      const response = await fetch(API_ENDPOINTS.BATTLES.RANDOM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          difficulty: difficulty.id,
          aiDifficulty: difficulty.aiLevel
        })
      });

      if (!response.ok) {
        throw new Error('Não foi possível iniciar a batalha');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Redirecionar para a página da batalha
        router.push(`/battle/${data.data.id}`);
      } else {
        throw new Error(data.message || 'Erro ao iniciar batalha');
      }
    } catch (error) {
      console.error('Erro ao iniciar batalha:', error);
      setError(error instanceof Error ? error.message : 'Erro ao iniciar batalha');
      setIsStarting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.primary }}>
        Nova Batalha
      </h2>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800">
          {error}
        </div>
      )}
      
      <p className="mb-6" style={{ color: theme.colors.text }}>
        Selecione a dificuldade da batalha:
      </p>
      
      <div className="space-y-4 mb-6">
        {DIFFICULTY_OPTIONS.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg cursor-pointer border-2 ${
              selectedDifficulty === option.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{ 
              backgroundColor: theme.colors.background,
              borderColor: selectedDifficulty === option.id ? theme.colors.primary : theme.colors.background
            }}
            onClick={() => setSelectedDifficulty(option.id)}
          >
            <div className="flex items-center">
              <div className="mr-4">
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium" style={{ color: theme.colors.primary }}>
                  {option.label}
                </h3>
                <p className="text-sm" style={{ color: theme.colors.text }}>
                  {option.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          disabled={!selectedDifficulty || isStarting}
          onClick={startBattle}
          className={`py-3 px-8 rounded-md flex items-center justify-center ${
            !selectedDifficulty || isStarting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
        >
          {isStarting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              <span>Iniciando...</span>
            </>
          ) : (
            <>
              <FaDice className="mr-2" />
              <span>Iniciar Batalha Aleatória</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DifficultySelector; 