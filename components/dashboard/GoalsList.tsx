import { useState } from 'react';
import { motion } from 'framer-motion';

interface Goal {
  id: string | number;
  title: string;
  completed: boolean;
  type: string;
  optional?: boolean;
}

interface GoalsListProps {
  goals: Goal[];
  onGoalComplete: (goalId: string | number) => void;
  houseColor: string;
}

const GoalsList = ({ goals, onGoalComplete, houseColor }: GoalsListProps) => {
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  
  // Separar metas obrigatórias e opcionais
  const requiredGoals = goals.filter(goal => !goal.optional);
  const optionalGoals = goals.filter(goal => goal.optional);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Metas Diárias</h2>
        <div className="text-sm bg-gray-700 px-3 py-1 rounded-full">
          <span className="text-green-400 font-bold">{completedGoals}</span>
          <span className="text-gray-300">/{totalGoals}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {requiredGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onComplete={() => onGoalComplete(goal.id)} 
          />
        ))}
        
        {optionalGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onComplete={() => onGoalComplete(goal.id)}
            isOptional
          />
        ))}
      </div>
    </div>
  );
};

interface GoalCardProps {
  goal: Goal;
  onComplete: () => void;
  isOptional?: boolean;
}

const GoalCard = ({ goal, onComplete, isOptional = false }: GoalCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onComplete();
      setIsAnimating(false);
    }, 500);
  };
  
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Estudo': '#4169E1',
      'Exercício': '#FF4500',
      'Meditação': '#9370DB',
      'Leitura': '#2E8B57',
      'Música': '#CD853F',
      'Culinária': '#FF6347',
      // Adicionar mais tipos conforme necessário
    };
    
    return colors[type] || '#666666';
  };
  
  return (
    <motion.div 
      className={`p-4 rounded-lg border border-gray-700 transition-all duration-300 relative overflow-hidden ${
        goal.completed ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-800 bg-opacity-50'
      } ${isOptional ? 'border-yellow-500/30' : ''}`}
      whileHover={{ scale: 1.02 }}
      onClick={handleComplete}
      animate={isAnimating ? { y: [0, -5, 0] } : {}}
    >
      {/* Indicador de tipo */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: getTypeColor(goal.type) }}
      />
      
      {/* Status da meta */}
      <div className="flex justify-between items-start mb-2">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          style={{ 
            backgroundColor: goal.completed ? '#4CAF50' : 'transparent',
            border: goal.completed ? 'none' : '2px solid #9CA3AF'
          }}
        >
          {goal.completed && <span className="text-xs text-white">✓</span>}
        </div>
        
        <div 
          className="text-xs px-2 py-0.5 rounded"
          style={{ 
            backgroundColor: getTypeColor(goal.type) + '30',
            color: getTypeColor(goal.type)
          }}
        >
          {goal.type}
        </div>
      </div>
      
      {/* Título da meta */}
      <div className="ml-8">
        <h3 className={`text-md font-medium transition-all duration-300 ${
          goal.completed ? 'text-gray-400 line-through' : 'text-white'
        }`}>
          {goal.title}
        </h3>
        
        {isOptional && (
          <span className="text-xs text-yellow-500 mt-1 inline-block">Meta opcional</span>
        )}
      </div>
      
      {/* Confete quando completar */}
      {isAnimating && goal.completed && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl"></span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalsList; 