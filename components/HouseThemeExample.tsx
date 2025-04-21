import React from 'react';
import Image from 'next/image';
import { useHouseTheme } from '../hooks/useHouseTheme';
import useAuth from '../hooks/useAuth';

const HouseThemeExample: React.FC = () => {
  const { theme } = useHouseTheme();
  const { user } = useAuth();

  return (
    <div 
      className="rounded-lg shadow-lg overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div 
        className="p-4 border-b"
        style={{ borderColor: theme.colors.primary }}
      >
        <h2 
          className="text-xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          {user?.house?.name || 'Bem-vindo ao Mindforge'}
        </h2>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden">
            <Image
              src={theme.flagImage}
              alt={theme.name}
              fill
              style={{ objectFit: 'cover' }}
              priority={false}
              onError={(e) => {
                // Fallback para logo padrão se a imagem não carregar
                e.currentTarget.src = '/images/logo.png';
              }}
            />
          </div>
          <div>
            <p style={{ color: theme.colors.text }}>
              {user ? `Olá, ${user.username}!` : 'Visitante'}
            </p>
            <p 
              className="text-sm"
              style={{ color: theme.colors.secondary }}
            >
              {theme.name !== 'MINDFORGE' 
                ? `Membro da casa ${theme.name}` 
                : 'Escolha sua casa ao se registrar'}
            </p>
          </div>
        </div>

        <button
          className="w-full py-2 rounded-md transition-colors duration-200"
          style={{ 
            backgroundColor: theme.colors.primary,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.accent}`
          }}
        >
          Botão Personalizado
        </button>
      </div>
    </div>
  );
};

export default HouseThemeExample; 