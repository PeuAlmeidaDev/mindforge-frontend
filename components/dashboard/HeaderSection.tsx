import React, { useState, useEffect } from 'react';
import MenuButton from './MenuButton';
import DashboardHeader from './DashboardHeader';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';

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
  const { logout, refreshUserData } = useAuth();
  const { refreshUserData: userRefresh } = useUser();
  
  // Atualizações apenas quando o HeaderSection é montado pela primeira vez
  // e não a cada mudança de rota
  useEffect(() => {
    // Eliminar esta atualização automática, pois está causando atualizações excessivas
    // As atualizações serão feitas em pontos específicos da aplicação
  }, []);
  
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
    } else if (path.includes('/profile')) {
      setActiveTab('profile');
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
          experience={user?.experience || 0}
          experienceToNextLevel={user?.experienceToNextLevel || 100}
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
              
              <div className="relative group">
                <MenuButton 
                  label="Ranking" 
                  isActive={activeTab === 'ranking'} 
                  onClick={() => {}}
                  theme={theme}
                  disabled={true}
                  icon={
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3 w-3 ml-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" 
                      />
                    </svg>
                  }
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="text-center">
                    Ranking estará disponível em breve!
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <MenuButton 
                label="Perfil" 
                isActive={activeTab === 'profile'} 
                onClick={() => router.push('/profile')}
                theme={theme}
              />
              
              <MenuButton 
                label="Sair" 
                isActive={false} 
                onClick={() => logout()}
                theme={{
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#FF4D4D'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 