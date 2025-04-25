import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GoalsList from './GoalsList';

interface DailyGoalsCardProps {
  theme: any;
  goals: any[];
  loadingGoals: boolean;
  onGoalComplete: (goalId: string | number) => void;
  onGenerateGoals: () => Promise<void>;
}

const DailyGoalsCard: React.FC<DailyGoalsCardProps> = ({ 
  theme, 
  goals, 
  loadingGoals, 
  onGoalComplete,
  onGenerateGoals
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [previousGoalsLength, setPreviousGoalsLength] = useState(0);
  
  // Monitora mudanças no número de metas para apresentar feedback
  useEffect(() => {
    // Se já tinha 0 metas e agora tem metas após uma geração
    if (previousGoalsLength === 0 && goals.length > 0 && isGenerating) {
      setFeedbackMessage({
        type: 'success',
        text: `${goals.length} metas diárias geradas com sucesso!`
      });
      setIsGenerating(false);
      
      // Limpar a mensagem após 5 segundos
      setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
    }
    
    // Se o carregamento terminou, desativar o estado de geração
    if (isGenerating && !loadingGoals && goals.length > 0) {
      setIsGenerating(false);
    }
    
    setPreviousGoalsLength(goals.length);
  }, [goals.length, isGenerating, previousGoalsLength, loadingGoals]);
  
  const handleGenerateGoals = async () => {
    setIsGenerating(true);
    setFeedbackMessage(null);
    
    try {
      await onGenerateGoals();
      
      // Se as metas ainda não foram atualizadas no estado,
      // apenas definir uma mensagem provisória
      if (goals.length === 0) {
        setFeedbackMessage({
          type: 'success',
          text: 'Metas diárias geradas! Carregando...'
        });
      }
    } catch (error) {
      console.error('Erro ao gerar metas:', error);
      setFeedbackMessage({
        type: 'error',
        text: 'Não foi possível gerar as metas. Tente novamente mais tarde.'
      });
      setIsGenerating(false);
    }
  };
  
  // Verificar se deve mostrar o botão de gerar metas
  const shouldShowGenerateButton = goals.length === 0 || (goals.length > 0 && !loadingGoals);
  
  return (
    <section 
      className="backdrop-blur-sm rounded-xl p-6 transition-all"
      style={{ 
        background: `linear-gradient(160deg, ${theme.colors.background}85 0%, ${theme.colors.background}95 100%)`,
        borderTop: `4px solid ${theme.colors.primary}`,
        boxShadow: `0 10px 30px ${theme.colors.primary}10, inset 0 1px 0 ${theme.colors.primary}30`
      }}
    >
      <h2 
        className="text-xl font-bold mb-6 flex items-center"
        style={{ color: theme.colors.primary }}
      >
        <span className="mr-2"></span>
        Metas de Hoje
      </h2>
      
      {/* Mensagem de feedback */}
      {feedbackMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-4 p-3 rounded-lg ${
            feedbackMessage.type === 'success' 
              ? 'bg-green-900/30 border border-green-800/50' 
              : 'bg-red-900/30 border border-red-800/50'
          }`}
          style={{
            color: feedbackMessage.type === 'success' ? '#4caf50' : '#f44336'
          }}
        >
          {feedbackMessage.text}
        </motion.div>
      )}
      
      {loadingGoals || isGenerating ? (
        <div className="py-10 flex flex-col items-center justify-center">
          <div 
            className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin mb-4"
            style={{ 
              borderColor: `${theme.colors.primary}60`,
              borderTopColor: 'transparent',
              boxShadow: `0 0 10px ${theme.colors.primary}30`
            }}
          ></div>
          <p className="text-sm text-gray-400">
            {isGenerating ? 'Gerando metas...' : 'Carregando metas...'}
          </p>
        </div>
      ) : goals.length > 0 ? (
        <GoalsList 
          goals={goals} 
          onGoalComplete={onGoalComplete} 
          houseColor={theme.colors.primary}
        />
      ) : (
        <div className="py-6 text-center">
          <p className="text-gray-400 mb-4">Você ainda não tem metas para hoje.</p>
          <button 
            onClick={handleGenerateGoals}
            disabled={isGenerating}
            className="px-6 py-2 rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary}90 100%)`,
              color: theme.colors.background,
              boxShadow: `0 4px 10px ${theme.colors.primary}40, inset 0 1px 0 ${theme.colors.secondary}50`,
              opacity: isGenerating ? 0.7 : 1
            }}
          >
            {isGenerating ? 'Gerando...' : 'Definir Metas'}
          </button>
        </div>
      )}
    </section>
  );
};

export default DailyGoalsCard; 