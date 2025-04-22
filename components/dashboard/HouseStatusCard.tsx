import React from 'react';
import { motion } from 'framer-motion';
import { NextRouter } from 'next/router';
import HouseBanner from './HouseBanner';

interface HouseStatusCardProps {
  theme: any;
  houseName: string;
  router: NextRouter;
  houseId: string;
}

const HouseStatusCard: React.FC<HouseStatusCardProps> = ({ 
  theme, 
  houseName, 
  router, 
  houseId 
}) => (
  <div 
    className="mb-6 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-all relative"
    style={{ 
      background: `linear-gradient(135deg, ${theme.colors.background}90 0%, ${theme.colors.primary}15 100%)`,
      borderLeft: `4px solid ${theme.colors.primary}`,
      borderBottom: `1px solid ${theme.colors.secondary}30`,
      boxShadow: `0 4px 15px ${theme.colors.primary}30`
    }}
  >
    <div className="absolute top-0 right-0 transform -translate-y-1/2 md:translate-y-0 md:translate-x-0 md:relative md:top-auto md:right-auto">
      <HouseBanner houseId={houseId} size="small" />
    </div>
    
    <div className="flex items-center">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)` 
        }}
      >
        <span className="text-lg"></span>
      </div>
      <div>
        <h3 
          className="font-bold text-lg"
          style={{ color: theme.colors.primary }}
        >
          {houseName}
        </h3>
        <p className="text-sm opacity-70">Posição: #3 no ranking geral</p>
      </div>
    </div>
    
    <div className="flex gap-3">
      <button 
        className="px-4 py-2 rounded-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.background}95 0%, ${theme.colors.primary}15 100%)`,
          border: `1px solid ${theme.colors.primary}40`,
          boxShadow: `0 2px 5px rgba(0,0,0,0.2)`
        }}
        onClick={() => router.push(`/house/${houseId}/members`)}
      >
        Ver Membros
      </button>
      <button 
        className="px-4 py-2 rounded-lg transition-all hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary}90 100%)`,
          color: theme.colors.background,
          boxShadow: `0 2px 8px ${theme.colors.primary}60`
        }}
        onClick={() => router.push(`/house/${houseId}`)}
      >
        Desafios da Casa
      </button>
    </div>
  </div>
);

export default HouseStatusCard; 