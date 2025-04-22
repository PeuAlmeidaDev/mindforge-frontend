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
    className="backdrop-blur-sm rounded-xl p-6 transition-all"
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
    </h2>
    <ActivityFeed activities={activities} theme={theme} />
  </section>
);

export default ActivityFeedCard; 