import React, { useState, useEffect } from 'react';
import MenuButton from './MenuButton';
import DashboardHeader from './DashboardHeader';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';

interface HeaderSectionProps {
  theme: any;
  user: any;
  houseName: string;
  hasHouse: boolean;
  houseId: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  theme, 
  user, 
  houseName, 
  hasHouse,
  houseId
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const { logout } = useAuth();
  
  // Atualizar a aba ativa com base na rota atual
  useEffect(() => {
    const path = router.pathname;
    if (path.includes('/dashboard')) {
      setActiveTab('dashboard');
    } else if (path.includes('/battle')) {
      setActiveTab('battle');
    } else if (path.includes('/house')) {
      setActiveTab('house');
    } else if (path.includes('/ranking')) {
      setActiveTab('ranking');
    }
  }, [router.pathname]);
  
  const hexToRgb = (hex: string) => {
    // Remover o # do início se existir
    const h = hex.replace(/^#/, '');
    
    // Converter para RGB
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  };
  
  return (
    <div className="relative">
      {/* Header com informações do usuário */}
      <div 
        className="relative overflow-visible"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, ${theme.colors.primary}20 0%, transparent 100%)`,
          borderBottom: `1px solid ${theme.colors.primary}30`
        }}
      >
        <DashboardHeader 
          name={user?.username || 'Aventureiro'}
          level={user?.level || 1}
          elementalType={user?.primaryElementalType || 'Normal'}
          house={houseName}
          houseColor={theme.colors.primary}
        />
      </div>
      
      {/* Barra de navegação */}
      <div 
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ 
          backgroundColor: `rgba(${hexToRgb(theme.colors.backgroundDark).r}, ${hexToRgb(theme.colors.backgroundDark).g}, ${hexToRgb(theme.colors.backgroundDark).b}, 0.8)`,
          borderBottom: `1px solid ${theme.colors.primary}10`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex space-x-1">
              <MenuButton 
                label="Dashboard" 
                isActive={activeTab === 'dashboard'} 
                onClick={() => router.push('/dashboard')}
                theme={theme}
              />
              
              <MenuButton 
                label="Batalha" 
                isActive={activeTab === 'battle'} 
                onClick={() => router.push('/battle')}
                theme={theme}
              />
              
              <MenuButton 
                label="Casa" 
                isActive={activeTab === 'house'} 
                onClick={() => router.push('/house')}
                theme={theme}
              />
              
              <MenuButton 
                label="Ranking" 
                isActive={activeTab === 'ranking'} 
                onClick={() => router.push('/ranking')}
                theme={theme}
              />
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="relative px-3 py-1.5 text-xs tracking-wide uppercase font-medium rounded-md transition-all duration-300 group"
                style={{
                  color: `${theme.colors.text}90`,
                  backgroundColor: 'transparent'
                }}
                onClick={() => router.push('/profile')}
              >
                Perfil
                {/* Efeito de hover */}
                <div 
                  className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ backgroundColor: theme.colors.primary }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: theme.colors.primary }}
                ></div>
              </button>
              
              <button 
                className="relative px-3 py-1.5 text-xs tracking-wide uppercase font-medium rounded-md transition-all duration-300 group"
                style={{
                  color: `${theme.colors.text}90`,
                  backgroundColor: 'transparent'
                }}
                onClick={() => logout()}
              >
                Sair
                {/* Efeito de hover */}
                <div 
                  className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                  style={{ backgroundColor: '#FF4D4D' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0 group-hover:h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ backgroundColor: '#FF4D4D' }}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 