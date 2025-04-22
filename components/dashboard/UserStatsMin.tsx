import { motion } from 'framer-motion';
import useHouseTheme from '../../hooks/useHouseTheme';

interface UserStatsProps {
  stats: {
    health: number;
    physicalAttack: number;
    specialAttack: number;
    specialDefense: number;
    physicalDefense: number;
    speed: number;
  };
  theme?: any;
  elegantMode?: boolean;
  attributePointsToDistribute?: number;
}

const UserStatsMin = ({ stats, theme: propTheme, elegantMode = true, attributePointsToDistribute = 0 }: UserStatsProps) => {
  const { theme: hookTheme } = useHouseTheme();
  const theme = propTheme || hookTheme;
  
  // Calcular o valor máximo
  const maxStat = Math.max(
    stats.health / 10,
    stats.physicalAttack,
    stats.specialAttack,
    stats.physicalDefense,
    stats.specialDefense,
    stats.speed
  );
  
  // Calcular a média dos stats
  const totalValue = Math.floor(
    (stats.health / 10 + 
    stats.physicalAttack + 
    stats.specialAttack + 
    stats.physicalDefense + 
    stats.specialDefense + 
    stats.speed) / 6
  );
  
  // Função para classificar atributo
  const getStatRating = (value: number) => {
    const normalized = value / maxStat;
    
    if (normalized >= 0.9) return "Excelente";
    if (normalized >= 0.7) return "Ótimo";
    if (normalized >= 0.5) return "Bom";
    if (normalized >= 0.3) return "Regular";
    return "Básico";
  };
  
  // Função para obter o estilo baseado na classificação
  const getRatingStyle = (value: number) => {
    const normalized = value / maxStat;
    
    if (normalized >= 0.9) return { className: "font-bold", color: theme.colors.text };
    if (normalized >= 0.7) return { className: "font-semibold", color: `${theme.colors.text}E0` };
    if (normalized >= 0.5) return { className: "font-medium", color: `${theme.colors.text}C0` };
    if (normalized >= 0.3) return { className: "font-normal", color: `${theme.colors.text}A0` };
    return { className: "font-light", color: `${theme.colors.text}80` };
  };
  
  return (
    <div className="space-y-4">
      {/* Visão geral */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm" style={{ color: `${theme.colors.text}90` }}>Poder de Batalha</div>
          <div className="text-3xl font-bold" style={{ color: theme.colors.primary }}>{totalValue * 10}</div>
        </div>
        
        <div className="flex space-x-2">
          <div className="text-center px-3 py-2 rounded-md backdrop-blur-sm" 
            style={{ 
              backgroundColor: `${theme.colors.backgroundDark}80`,
              border: `1px solid ${theme.colors.primary}30`
            }}>
            <div className="text-xs" style={{ color: `${theme.colors.text}80` }}>Pontos</div>
            <div className="font-semibold" style={{ color: theme.colors.text }}>{attributePointsToDistribute}</div>
          </div>
          
          <div className="text-center px-3 py-2 rounded-md backdrop-blur-sm" 
            style={{ 
              backgroundColor: `${theme.colors.backgroundDark}80`,
              border: `1px solid ${theme.colors.primary}30`
            }}>
            <div className="text-xs" style={{ color: `${theme.colors.text}80` }}>Rank</div>
            <div className="font-semibold" style={{ color: theme.colors.text }}>
              {totalValue < 10 ? 'D' : totalValue < 15 ? 'C' : totalValue < 20 ? 'B' : totalValue < 25 ? 'A' : 'S'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de atributos em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
        {Object.entries(stats).map(([key, value], index) => {
          const statKey = key as keyof typeof stats;
          const statValue = statKey === 'health' ? value / 10 : value;
          const rating = getStatRating(statValue);
          const ratingStyle = getRatingStyle(statValue);
          
          return (
            <motion.div 
              key={key} 
              className="flex items-center justify-between pb-2"
              style={{ borderBottom: `1px solid ${theme.colors.primary}20` }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
            >
              <span className="text-sm" style={{ color: theme.colors.text }}>{formatStatName(statKey)}</span>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium" style={{ color: theme.colors.text }}>{value}</span>
                <span className={`text-xs ${ratingStyle.className}`} style={{ color: ratingStyle.color }}>{rating}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Atributo mais forte */}
      <motion.div 
        className="pt-3 mt-2"
        style={{ borderTop: `1px solid ${theme.colors.primary}30` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-xs text-center" style={{ color: `${theme.colors.text}80` }}>
          Atributo mais forte: <span className="font-medium" style={{ color: theme.colors.primary }}>{getStrongestStat(stats)}</span>
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

export default UserStatsMin; 