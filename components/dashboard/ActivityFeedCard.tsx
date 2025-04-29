import React from 'react';
import { motion } from 'framer-motion';
import ActivityFeed from './ActivityFeed';

interface Activity {
  id: number;
  text: string;
  icon: string;
  timestamp: string;
}

interface ActivityFeedCardProps {
  theme: any;
  activities: Activity[];
  hasHouse: boolean;
}

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({ 
  theme, 
  activities, 
  hasHouse 
}) => (
  <section 
    className="backdrop-blur-sm rounded-xl p-6 transition-all relative"
    style={{ 
      background: `linear-gradient(160deg, ${theme.colors.background}85 0%, ${theme.colors.background}95 100%)`,
      boxShadow: `0 10px 30px ${theme.colors.primary}10, inset 0 1px 0 ${theme.colors.primary}30`,
      borderBottom: hasHouse ? `4px solid ${theme.colors.primary}` : 'none'
    }}
  >
    <h2 
      className="text-xl font-bold mb-6 flex items-center"
      style={{ color: theme.colors.primary }}
    >
      <span className="mr-2"></span>
      Atividades
      <div className="relative inline-block group ml-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
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
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="text-center">
            Histórico de atividades estará disponível em breve!
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </h2>
    
    {/* Overlay semi-transparente com cadeado central */}
    <div className="absolute inset-0 rounded-xl bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="p-4 rounded-full bg-black bg-opacity-40">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-10 w-10" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke={theme.colors.primary}
          strokeOpacity="0.8"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 10-8 0v4h8z" 
          />
        </svg>
      </div>
    </div>
    
    {/* Conteúdo com opacidade reduzida */}
    <div className="opacity-30">
      <ActivityFeed activities={activities} theme={theme} />
    </div>
  </section>
);

export default ActivityFeedCard; 