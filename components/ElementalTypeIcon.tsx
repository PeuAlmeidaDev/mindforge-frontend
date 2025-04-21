import React from 'react';
import { 
  FaFire, FaWater, FaMountain, FaWind, FaSun, FaMoon, FaLeaf,
  FaBolt, FaSnowflake, FaBrain, FaGhost, FaShieldAlt, FaSkull, 
  FaFeather, FaGem
} from 'react-icons/fa';
import { 
  GiIceCube, GiPsychicWaves, GiSteelClaws, GiPoison, GiRock, 
  GiWaterDrop, GiEarthCrack, GiWindSlap, GiTreeRoots 
} from 'react-icons/gi';
import { WiMoonAltNew } from 'react-icons/wi';

interface ElementalTypeIconProps {
  type: string;
  size?: number;
  className?: string;
  showTooltip?: boolean;
}

// Mapeamento de tipos em português para inglês (para retrocompatibilidade)
const typeMapping: Record<string, string> = {
  // Tipos em português
  'fogo': 'fire',
  'água': 'water',
  'terra': 'earth',
  'ar': 'air',
  'luz': 'light',
  'sombra': 'dark',
  'natureza': 'nature',
  'elétrico': 'electric',
  'gelo': 'ice',
  'psíquico': 'psychic',
  'fantasma': 'ghost',
  'aço': 'steel',
  'veneno': 'poison',
  'voador': 'flying',
  'pedra': 'rock',
  
  // Manter os tipos em inglês para retrocompatibilidade
  'fire': 'fire',
  'water': 'water',
  'earth': 'earth',
  'air': 'air',
  'light': 'light',
  'dark': 'dark',
  'nature': 'nature',
  'electric': 'electric',
  'ice': 'ice',
  'psychic': 'psychic',
  'ghost': 'ghost',
  'steel': 'steel',
  'poison': 'poison',
  'flying': 'flying',
  'rock': 'rock'
};

const ElementalTypeIcon: React.FC<ElementalTypeIconProps> = ({ 
  type, 
  size = 24, 
  className = '',
  showTooltip = false
}) => {
  // Normalizar o tipo para o formato interno (inglês)
  const normalizedType = typeMapping[type.toLowerCase()] || type;
  
  // Objeto com cores associadas a cada tipo elemental
  const elementColors: Record<string, string> = {
    fire: 'text-red-500',
    water: 'text-blue-500',
    earth: 'text-amber-800',
    air: 'text-sky-300',
    light: 'text-yellow-300',
    dark: 'text-purple-900',
    nature: 'text-green-500',
    electric: 'text-yellow-400',
    ice: 'text-cyan-300',
    psychic: 'text-pink-400',
    ghost: 'text-indigo-400',
    steel: 'text-gray-400',
    poison: 'text-purple-500',
    flying: 'text-indigo-300',
    rock: 'text-stone-600'
  };
  
  // Descrições para cada tipo elemental em português
  const elementDescriptions: Record<string, string> = {
    fire: 'Fogo - Poder ofensivo e energético, representa paixão e determinação',
    water: 'Água - Adaptabilidade e fluidez, representa equilíbrio emocional',
    earth: 'Terra - Estabilidade e resistência, representa persistência',
    air: 'Ar - Liberdade e movimento, representa criatividade e comunicação',
    light: 'Luz - Clareza e inspiração, representa conhecimento e sabedoria',
    dark: 'Sombra - Mistério e introspecção, representa intuição profunda',
    nature: 'Natureza - Crescimento e harmonia, representa conexão e cura',
    electric: 'Elétrico - Velocidade e inovação, representa pensamento rápido',
    ice: 'Gelo - Preservação e calma, representa análise e estratégia',
    psychic: 'Psíquico - Poder mental e percepção, representa consciência expandida',
    ghost: 'Fantasma - Transformação e transcendência, representa conexão espiritual',
    steel: 'Aço - Força e durabilidade, representa proteção e confiabilidade',
    poison: 'Veneno - Adaptação e resiliência, representa transformação e superação',
    flying: 'Voador - Liberdade e perspectiva, representa visão ampla',
    rock: 'Pedra - Solidez e proteção, representa fundação e tradição'
  };

  // Obter a cor para o tipo elemental
  const colorClass = elementColors[normalizedType] || 'text-gray-500';
  const combinedClass = `${colorClass} ${className}`;
  const description = elementDescriptions[normalizedType] || 'Tipo desconhecido';

  // Renderizar o ícone apropriado baseado no tipo
  const getIcon = () => {
    switch (normalizedType) {
      case 'fire':
        return <FaFire size={size} className={combinedClass} />;
      case 'water':
        return <GiWaterDrop size={size} className={combinedClass} />;
      case 'earth':
        return <GiEarthCrack size={size} className={combinedClass} />;
      case 'air':
        return <GiWindSlap size={size} className={combinedClass} />;
      case 'light':
        return <FaSun size={size} className={combinedClass} />;
      case 'dark':
        return <WiMoonAltNew size={size} className={combinedClass} />;
      case 'nature':
        return <GiTreeRoots size={size} className={combinedClass} />;
      case 'electric':
        return <FaBolt size={size} className={combinedClass} />;
      case 'ice':
        return <GiIceCube size={size} className={combinedClass} />;
      case 'psychic':
        return <GiPsychicWaves size={size} className={combinedClass} />;
      case 'ghost':
        return <FaGhost size={size} className={combinedClass} />;
      case 'steel':
        return <GiSteelClaws size={size} className={combinedClass} />;
      case 'poison':
        return <GiPoison size={size} className={combinedClass} />;
      case 'flying':
        return <FaFeather size={size} className={combinedClass} />;
      case 'rock':
        return <GiRock size={size} className={combinedClass} />;
      default:
        return <FaGem size={size} className={`text-gray-400 ${className}`} />;
    }
  };

  const iconElement = getIcon();

  return showTooltip ? (
    <div className="group relative inline-block">
      {iconElement}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-52 px-3 py-2 bg-black/90 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        {description}
      </div>
    </div>
  ) : iconElement;
};

export default ElementalTypeIcon; 