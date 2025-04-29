import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import { FaChevronLeft } from 'react-icons/fa';
import DifficultySelector from './DifficultySelector';
import BattlesList from './BattlesList';
import HeaderSection from '../dashboard/HeaderSection';

const BattleHomeLayout: React.FC = () => {
  const { theme } = useHouseTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'ongoing' | 'new'>('ongoing');
  
  // Informações baseadas no usuário
  const houseId = user?.house?.id || '';
  const hasHouse = Boolean(user && user.house && user.house.name);
  const houseName = user?.house?.name || 'Sem Casa';
  
  return (
    <div 
      className="min-h-screen pb-6"
      style={{ backgroundColor: theme.colors.backgroundDark }}
    >
      {/* Header e Banner utilizando os mesmos componentes do dashboard */}
      <HeaderSection
        theme={theme}
        user={user}
        houseName={houseName}
        hasHouse={hasHouse}
        houseId={houseId}
      />
      
      {/* Título da seção de batalha */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-full mr-4 flex items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <FaChevronLeft color={theme.colors.text} />
          </button>
          <h1 
            className="text-2xl font-bold"
            style={{ color: theme.colors.primary }}
          >
            Arena de Batalha
          </h1>
        </div>
      
        {/* Tabs - Corrigido para área clicável completa */}
        <div className="flex mt-6 mb-4 border-b"
          style={{ borderColor: theme.colors.primary }}>
          <div className="relative">
            <button 
              className={`relative z-10 py-2 px-4 font-medium flex items-center justify-center w-full h-full ${selectedTab === 'ongoing' ? 'border-b-2' : ''}`}
              style={{ 
                color: selectedTab === 'ongoing' ? theme.colors.primary : theme.colors.text,
                borderColor: theme.colors.primary
              }}
              onClick={() => setSelectedTab('ongoing')}
            >
              <span className="pointer-events-none">Minhas Batalhas</span>
            </button>
          </div>
          <div className="relative ml-4">
            <button 
              className={`relative z-10 py-2 px-4 font-medium flex items-center justify-center w-full h-full ${selectedTab === 'new' ? 'border-b-2' : ''}`}
              style={{ 
                color: selectedTab === 'new' ? theme.colors.primary : theme.colors.text,
                borderColor: theme.colors.primary
              }}
              onClick={() => setSelectedTab('new')}
            >
              <span className="pointer-events-none">Nova Batalha</span>
            </button>
          </div>
        </div>
      
        {/* Content based on selected tab */}
        <div>
          {selectedTab === 'ongoing' ? (
            <BattlesList />
          ) : (
            <DifficultySelector />
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleHomeLayout; 