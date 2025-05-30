import React, { ReactNode } from 'react';

interface MenuButtonProps {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  theme: any;
  disabled?: boolean;
  icon?: ReactNode;
}

const MenuButton: React.FC<MenuButtonProps> = ({ 
  label, 
  onClick, 
  isActive = false,
  theme,
  disabled = false,
  icon
}) => (
  <button 
    className={`
      relative w-full md:w-auto px-3 py-2.5 transition-all duration-300 text-sm group 
      ${disabled ? 'cursor-not-allowed' : 'hover:bg-white/5'}
      ${isActive ? 'bg-white/10' : ''}
    `}
    onClick={disabled ? undefined : onClick}
  >
    <span className={`
      relative z-10 transition-all duration-300 flex items-center justify-center md:justify-start
      ${isActive ? 'font-medium' : disabled ? '' : 'group-hover:text-white'}
    `}
    style={{
      color: isActive 
        ? theme.colors.text 
        : disabled 
          ? `${theme.colors.text}30` 
          : `${theme.colors.text}50`
    }}
    >
      {label}
      {icon && <span className="ml-1">{icon}</span>}
    </span>
    
    {/* Indicador de ativo */}
    {isActive && !disabled ? (
      <div 
        className="absolute bottom-0 left-0 md:left-1/2 w-1 md:w-1/2 h-full md:h-0.5 rounded-full transform md:-translate-x-1/2" 
        style={{ backgroundColor: `${theme.colors.primary}80` }}
      />
    ) : !disabled ? (
      <div 
        className="absolute bottom-0 left-0 md:left-1/2 w-0 md:w-0 h-full md:h-0.5 rounded-full transform md:-translate-x-1/2 transition-all duration-300 group-hover:w-1 md:group-hover:w-1/3" 
        style={{ backgroundColor: `${theme.colors.primary}50` }}
      />
    ) : null}
    
    {/* Efeito de hover */}
    {!disabled && (
      <div 
        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{ backgroundColor: theme.colors.primary }}
      />
    )}
  </button>
);

export default MenuButton; 