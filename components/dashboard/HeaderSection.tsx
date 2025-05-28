import React, { useState, useEffect } from 'react';
import MenuButton from './MenuButton';
import DashboardHeader from './DashboardHeader';
import { useRouter } from 'next/router';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { logout, refreshUserData } = useAuth();
  const { refreshUserData: userRefresh } = useUser();
  
  // Fechar o menu mobile quando mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);
  
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
  
  const menuItems = [
    {
      label: "Dashboard",
      route: "/dashboard",
      id: "dashboard"
    },
    {
      label: "Batalha",
      route: "/battle",
      id: "battle"
    },
    {
      label: "Casa",
      route: "/house",
      id: "house"
    },
    {
      label: "Ranking",
      route: "/ranking",
      id: "ranking",
      disabled: true
    },
    {
      label: "Perfil",
      route: "/profile",
      id: "profile"
    }
  ];
  
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
            {/* Menu Desktop */}
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <MenuButton 
                  key={item.id}
                  label={item.label} 
                  isActive={activeTab === item.id} 
                  onClick={() => !item.disabled && router.push(item.route)}
                  theme={theme}
                  disabled={item.disabled}
                  icon={item.disabled && (
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
                  )}
                />
              ))}
            </div>

            {/* Botão Menu Mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: theme.colors.text }}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Botões da direita */}
            <div className="hidden md:flex space-x-2">
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

          {/* Menu Mobile */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
                style={{ 
                  backgroundColor: `rgba(${hexToRgb(theme.colors.backgroundDark).r}, ${hexToRgb(theme.colors.backgroundDark).g}, ${hexToRgb(theme.colors.backgroundDark).b}, 0.95)`,
                }}
              >
                <div className="py-2 space-y-1">
                  {menuItems.map((item) => (
                    <MenuButton 
                      key={item.id}
                      label={item.label} 
                      isActive={activeTab === item.id} 
                      onClick={() => !item.disabled && router.push(item.route)}
                      theme={theme}
                      disabled={item.disabled}
                      icon={item.disabled && (
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
                      )}
                    />
                  ))}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 