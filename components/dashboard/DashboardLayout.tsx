import React from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  theme: any;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ theme, children }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen relative overflow-hidden pb-8"
    style={{ 
      background: `linear-gradient(180deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
      color: theme.colors.text 
    }}
  >
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
    
    {/* Elemento decorativo para telas grandes */}
    <div className="hidden lg:block absolute top-20 right-0 w-64 h-64 rounded-full opacity-5" 
      style={{ 
        background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)`,
        filter: 'blur(40px)'
      }} 
    />
    
    {/* Elemento decorativo para telas grandes */}
    <div className="hidden lg:block absolute bottom-20 left-0 w-80 h-80 rounded-full opacity-5" 
      style={{ 
        background: `radial-gradient(circle, ${theme.colors.secondary} 0%, transparent 70%)`,
        filter: 'blur(60px)'
      }} 
    />
    
    {/* Estilos globais para efeitos */}
    <style jsx global>{`
      /* Efeito sutil de brilho para bordas com cor do tema */
      [style*="border-left"], [style*="border-top"], [style*="border-bottom"] {
        position: relative;
        overflow: hidden;
      }
      
      [style*="border-left"]::before, [style*="border-top"]::before, [style*="border-bottom"]::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.03;
        z-index: 0;
      }
      
      [style*="border-left"]::before {
        background: linear-gradient(90deg, ${theme.colors.primary}50, transparent 20%);
      }
      
      /* Estilos responsivos */
      @media (max-width: 640px) {
        .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }
      }
    `}</style>
  </motion.div>
);

export default DashboardLayout; 