import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

interface QuickActionsProps {
  theme?: any;
}

const QuickActions = ({ theme }: QuickActionsProps) => {
  const router = useRouter();
  
  const actions = [
    { 
      id: 'battle', 
      title: 'Batalhar', 
      icon: '⚔️', 
      onClick: () => router.push('/battle')
    },
    { 
      id: 'house', 
      title: 'Casa', 
      icon: '🏰', 
      onClick: () => router.push('/house')
    },
    { 
      id: 'skills', 
      title: 'Skills', 
      icon: '✨', 
      onClick: () => router.push('/skills')
    },
    { 
      id: 'profile', 
      title: 'Perfil', 
      icon: '👤', 
      onClick: () => router.push('/profile')
    }
  ];
  
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Ações</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <ActionButton 
            key={action.id}
            action={action}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

interface ActionButtonProps {
  action: {
    id: string;
    title: string;
    icon: string;
    onClick: () => void;
  };
  index: number;
}

const ActionButton = ({ action, index }: ActionButtonProps) => {
  return (
    <motion.button
      className="flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm border border-white/10 py-3 px-2 rounded-lg transition-all"
      onClick={action.onClick}
      whileHover={{ 
        scale: 1.05,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="text-2xl mb-1">
        {action.icon}
      </div>
      
      <div className="text-center">
        <h3 className="font-medium text-sm text-white">{action.title}</h3>
      </div>
    </motion.button>
  );
};

export default QuickActions; 