import React from 'react';

interface LoadingScreenProps {
  theme: any;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ theme }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div 
      className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full"
      style={{ borderColor: theme.colors.primary }}
    ></div>
  </div>
);

export default LoadingScreen; 