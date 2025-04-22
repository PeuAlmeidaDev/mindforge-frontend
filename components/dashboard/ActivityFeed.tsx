import { motion } from 'framer-motion';
import { HouseTheme } from '../../lib/houseThemes';

interface Activity {
  id: number;
  text: string;
  icon: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  theme: HouseTheme;
}

const ActivityFeed = ({ activities, theme }: ActivityFeedProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-6 text-gray-400">
          <p>Nenhuma atividade recente para exibir.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <ActivityItem 
              key={activity.id}
              activity={activity}
              index={index}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ActivityItemProps {
  activity: Activity;
  index: number;
  theme?: HouseTheme;
}

const ActivityItem = ({ activity, index, theme }: ActivityItemProps) => {
  return (
    <motion.div 
      className="flex items-start p-3 rounded-lg bg-gray-800 bg-opacity-50 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ x: 5 }}
      style={{ 
        borderColor: theme ? `${theme.colors.primary}30` : undefined 
      }}
    >
      {activity.icon && (
        <div 
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-3"
          style={{ 
            backgroundColor: theme ? `${theme.colors.primary}30` : 'bg-gray-700' 
          }}
        >
          <span className="text-lg">{activity.icon}</span>
        </div>
      )}
      
      <div className="flex-grow">
        <p className="text-white">{activity.text}</p>
        <span className="text-xs text-gray-400">{activity.timestamp}</span>
      </div>
    </motion.div>
  );
};

export default ActivityFeed; 