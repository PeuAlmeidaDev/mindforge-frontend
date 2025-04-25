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
        <h2 className="text-xl font-bold" style={{ color: houseColor }}>Metas Diárias</h2>
        <div className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: `${houseColor}20` }}>
          <span style={{ color: houseColor, fontWeight: 'bold' }}>{completedGoals}</span>
          <span className="text-gray-300">/{totalGoals}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {requiredGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onComplete={() => onGoalComplete(goal.id)} 
            houseColor={houseColor}
          />
        ))}
        
        {optionalGoals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onComplete={() => onGoalComplete(goal.id)}
            isOptional
            houseColor={houseColor}
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
  houseColor: string;
}

const GoalCard = ({ goal, onComplete, isOptional = false, houseColor }: GoalCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onComplete();
      setIsAnimating(false);
    }, 500);
  };
  
  // Normaliza o tipo de interesse para um tipo conhecido
  const normalizeInterestType = (type: string): string => {
    // Converter para lowercase para melhor correspondência
    const lowerType = type.toLowerCase();
    
    // Mapear tipos comuns de interesse para categorias padrão
    if (lowerType.includes('estud') || lowerType.includes('academ') || lowerType.includes('conhecimento')) {
      return 'Estudo';
    }
    if (lowerType.includes('exerc') || lowerType.includes('fitness') || lowerType.includes('fís')) {
      return 'Exercício';
    }
    if (lowerType.includes('medit') || lowerType.includes('mind') || lowerType.includes('mental')) {
      return 'Meditação';
    }
    if (lowerType.includes('leit') || lowerType.includes('livr')) {
      return 'Leitura';
    }
    if (lowerType.includes('músic') || lowerType.includes('music') || lowerType.includes('arte')) {
      return 'Música';
    }
    if (lowerType.includes('culin') || lowerType.includes('cozinha') || lowerType.includes('food')) {
      return 'Culinária';
    }
    if (lowerType.includes('produtiv') || lowerType.includes('organiz')) {
      return 'Produtividade';
    }
    if (lowerType.includes('saúde') || lowerType.includes('bem-est') || lowerType.includes('health')) {
      return 'Saúde';
    }
    if (lowerType.includes('criat') || lowerType.includes('express')) {
      return 'Criatividade';
    }
    if (lowerType.includes('relac') || lowerType.includes('social')) {
      return 'Social';
    }
    
    // Se não corresponder a nenhum padrão, retornar o tipo original
    // Se for muito longo, truncar para exibição
    return type.length > 15 ? `${type.substring(0, 13)}...` : type;
  };
  
  const getTypeColor = (type: string) => {
    // Usar o tipo normalizado para buscar a cor
    const normalizedType = normalizeInterestType(type);
    
    // Usar cores com base no tema da casa, mas com variações para diferentes tipos
    // para manter a distinção visual entre os tipos de metas
    const baseColor = houseColor || '#607D8B';
    
    // HSL é mais fácil para manipular matiz, saturação e luminosidade
    // Vamos extrair o RGB e converter para HSL
    const hexToRgb = (hex: string): number[] => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result 
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ] 
        : [100, 100, 100];
    };
    
    // Converter RGB para HSL
    const rgbToHsl = (r: number, g: number, b: number): number[] => {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
      }
      
      return [h * 360, s * 100, l * 100];
    };
    
    // Converter HSL para Hex
    const hslToHex = (h: number, s: number, l: number): string => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    // Obter HSL a partir da cor da casa
    const rgb = hexToRgb(baseColor);
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    
    // Variar o matiz com base no tipo
    const typeHueShift: Record<string, number> = {
      'Estudo': 30,
      'Exercício': 60,
      'Meditação': 90,
      'Leitura': 120,
      'Música': 150,
      'Culinária': 180,
      'Produtividade': 210,
      'Saúde': 240,
      'Criatividade': 270,
      'Social': 300,
      'Geral': 0
    };
    
    // Ajustar o matiz, mantendo saturação e luminosidade
    const hueShift = typeHueShift[normalizedType] || 0;
    const newHue = (h + hueShift) % 360;
    
    // Manter saturação e luminosidade, apenas variar o matiz
    return hslToHex(newHue, s, l);
  };
  
  // Truncar título se for muito longo
  const displayTitle = goal.title && goal.title.length > 70 
    ? `${goal.title.substring(0, 67)}...` 
    : goal.title || 'Meta sem título';
  
  // Normalizar o tipo para exibição
  const displayType = normalizeInterestType(goal.type);
  
  // Determinar a cor do tipo com base no houseColor
  const typeColor = getTypeColor(goal.type);
  
  // Cor de fundo das metas baseada no tema da casa
  const bgColor = `rgba(${hexToRgba(houseColor, 0.1)})`;
  const borderColor = `rgba(${hexToRgba(houseColor, 0.3)})`;
  
  // Função auxiliar para converter hex para rgba
  function hexToRgba(hex: string, alpha: number = 1): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    
    if (!result) {
      return `0, 0, 0, ${alpha}`;
    }
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `${r}, ${g}, ${b}, ${alpha}`;
  }
  
  return (
    <motion.div 
      className={`p-4 rounded-lg border transition-all duration-300 relative overflow-hidden ${
        goal.completed ? 'opacity-70' : 'opacity-100'
      } ${isOptional ? '' : ''}`}
      style={{
        backgroundColor: goal.completed ? `rgba(${hexToRgba(houseColor, 0.05)})` : `rgba(${hexToRgba(houseColor, 0.1)})`,
        borderColor: isOptional ? `rgba(255, 193, 7, 0.3)` : borderColor
      }}
      whileHover={{ scale: 1.02 }}
      onClick={!goal.completed ? handleComplete : undefined}
      animate={isAnimating ? { y: [0, -5, 0] } : {}}
    >
      {/* Indicador de tipo */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ backgroundColor: typeColor }}
      />
      
      {/* Status da meta */}
      <div className="flex justify-between items-start mb-2">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          style={{ 
            backgroundColor: goal.completed ? houseColor : 'transparent',
            border: goal.completed ? 'none' : `2px solid ${houseColor}70`
          }}
        >
          {goal.completed && <span className="text-xs text-white">✓</span>}
        </div>
        
        <div 
          className="text-xs px-2 py-0.5 rounded"
          style={{ 
            backgroundColor: `${typeColor}30`,
            color: typeColor
          }}
        >
          {displayType}
        </div>
      </div>
      
      {/* Título da meta */}
      <div className="ml-8">
        <h3 className={`text-md font-medium transition-all duration-300 ${
          goal.completed ? 'line-through opacity-60' : ''
        }`}
        title={goal.title}
        style={{
          color: goal.completed ? `${houseColor}99` : '#fff'
        }}
        >
          {displayTitle}
        </h3>
        
        {isOptional && (
          <span className="text-xs mt-1 inline-block" style={{ color: 'rgba(255, 193, 7, 0.8)' }}>Meta opcional</span>
        )}
      </div>
      
      {/* Confete quando completar */}
      {isAnimating && !goal.completed && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-3xl">🎉</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoalsList; 