import { motion } from 'framer-motion';
import useHouseTheme from '../../hooks/useHouseTheme';

interface UserStatsProps {
  stats: {
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
  };
  theme?: any; // Adicionando theme como opcional
  elegantMode?: boolean; // Modo elegante para estilo mais sóbrio
}

const UserStats = ({ stats, theme: propTheme, elegantMode = false }: UserStatsProps) => {
  const { theme: hookTheme } = useHouseTheme();
  // Usar o tema fornecido nas props ou o do hook
  const theme = propTheme || hookTheme;
  
  // Calcular o valor máximo para escala
  const maxStat = Math.max(
    stats.health / 10, // Dividir health por 10 para escalar apropriadamente 
    stats.physicalAttack,
    stats.specialAttack,
    stats.physicalDefense,
    stats.specialDefense,
    stats.speed
  );
  
  // Calcular a média dos stats para mostrar no total
  const totalValue = Math.floor(
    (stats.health / 10 + 
    stats.physicalAttack + 
    stats.specialAttack + 
    stats.physicalDefense + 
    stats.specialDefense + 
    stats.speed) / 6
  );
  
  // Função para renderizar pontos de força
  const renderStrengthIndicator = (value: number) => {
    // Escala de 1 a 5 pontos
    const normalizedValue = Math.ceil((value / maxStat) * 5);
    
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index}
            className={`w-1.5 h-4 ${index < normalizedValue ? 'bg-white' : 'bg-white/20'} rounded-sm`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Visão geral dos atributos */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">Poder de Batalha</div>
          <div className="text-3xl font-bold text-white">
            {totalValue * 10}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="text-center px-3 py-2 rounded-md bg-black/20 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-gray-400">Nível</div>
            <div className="font-semibold">{Math.floor(totalValue / 5)}</div>
          </div>
          
          <div className="text-center px-3 py-2 rounded-md bg-black/20 backdrop-blur-sm border border-white/10">
            <div className="text-xs text-gray-400">Rank</div>
            <div className="font-semibold">
              {totalValue < 10 ? 'D' : totalValue < 15 ? 'C' : totalValue < 20 ? 'B' : totalValue < 25 ? 'A' : 'S'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de atributos com representação minimalista */}
      <div className="space-y-3 mt-2">
        {Object.entries(stats).map(([key, value], index) => {
          const statKey = key as keyof typeof stats;
          
          return (
            <motion.div 
              key={key} 
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <span className="text-sm text-white">{formatStatName(statKey)}</span>
              
              <div className="flex items-center">
                <span className="text-sm font-medium text-white mr-3">{value}</span>
                {renderStrengthIndicator(statKey === 'health' ? value / 10 : value)}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Atributo mais forte - minimalista */}
      <motion.div 
        className="border-t border-white/10 pt-3 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-xs text-center text-gray-400">
          Atributo mais forte: <span className="text-white font-medium">{getStrongestStat(stats)}</span>
        </div>
      </motion.div>
    </div>
  );
};

// Funções auxiliares
function formatStatName(stat: string): string {
  const formattedNames: Record<string, string> = {
    health: 'Vida',
    physicalAttack: 'Ataque Físico',
    specialAttack: 'Ataque Especial',
    physicalDefense: 'Defesa Física',
    specialDefense: 'Defesa Especial', 
    speed: 'Velocidade',
  };
  
  return formattedNames[stat] || stat;
}

function getStrongestStat(stats: UserStatsProps['stats']): string {
  const entries = Object.entries(stats);
  const withoutHealth = entries.filter(([key]) => key !== 'health');
  const strongest = withoutHealth.reduce((max, [key, value]) => 
    value > max[1] ? [key, value] : max, ['', 0]);
  
  return formatStatName(strongest[0]);
}

export default UserStats; 