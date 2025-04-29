import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import BattleHomeLayout from '../../components/battle/BattleHomeLayout';
import { motion } from 'framer-motion';

const BattlePage: NextPage = () => {
  const { theme } = useHouseTheme();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar para login se não estiver autenticado
  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.backgroundDark }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: theme.colors.primary }}></div>
          <p style={{ color: theme.colors.text }}>Carregando...</p>
        </motion.div>
      </div>
    );
  }

  return <BattleHomeLayout />;
};

export default BattlePage; 