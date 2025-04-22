import React from 'react';

interface DashboardLayoutProps {
  theme: any;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ theme, children }) => (
  <div 
    className="min-h-screen relative overflow-hidden"
    style={{ 
      background: `linear-gradient(180deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
      color: theme.colors.text 
    }}
  >
    {children}
    
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
    `}</style>
  </div>
);

export default DashboardLayout; 