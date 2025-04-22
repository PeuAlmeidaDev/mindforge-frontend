import React from 'react';
import { motion } from 'framer-motion';
import GoalsList from './GoalsList';

interface DailyGoalsCardProps {
  theme: any;
  goals: any[];
  loadingGoals: boolean;
  onGoalComplete: (goalId: string | number) => void;
}

const DailyGoalsCard: React.FC<DailyGoalsCardProps> = ({ 
  theme, 
  goals, 
  loadingGoals, 
  onGoalComplete 
}) => (
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
    
    {loadingGoals ? (
      <div className="py-10 flex justify-center">
        <div 
          className="w-10 h-10 border-4 rounded-full border-t-transparent animate-spin"
          style={{ 
            borderColor: `${theme.colors.primary}60`,
            borderTopColor: 'transparent',
            boxShadow: `0 0 10px ${theme.colors.primary}30`
          }}
        ></div>
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
          className="px-6 py-2 rounded-full transition-all hover:scale-105 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary}90 100%)`,
            color: theme.colors.background,
            boxShadow: `0 4px 10px ${theme.colors.primary}40, inset 0 1px 0 ${theme.colors.secondary}50`
          }}
        >
          Definir Metas
        </button>
      </div>
    )}
  </section>
);

export default DailyGoalsCard; 