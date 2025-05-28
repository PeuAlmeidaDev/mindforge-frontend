import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getThemeByHouseId } from '../../lib/houseThemes';

interface HouseBannerProps {
  houseId: string;
  size: string;
}

const HouseBanner = ({ houseId, size }: HouseBannerProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(1024);
  const theme = getThemeByHouseId(houseId);
  const [imagePath, setImagePath] = useState<string>('');

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Inicializar
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Definir o caminho da imagem da bandeira
  useEffect(() => {
    // Extrair o nome da casa para o caminho da pasta
    const getHouseFolder = () => {
      // Mapear os nomes padrão para as pastas do sistema de arquivos
      switch (theme.name) {
        case 'Flor do Espírito Dourado':
          return 'FlorDoEspiritoDourado';
        case 'Ordem das Três Faces':
          return 'OrdemDasTresFaces';
        case 'Alma das Águas Flamejantes':
          return 'AlmaDasAguasFlamejantes';
        case 'Chamas do Rugido':
          return 'ChamasDoRugido';
        case 'Kazoku no Okami':
          return 'KazokuNoOkami';
        default:
          return '';
      }
    };

    const folder = getHouseFolder();
    if (folder) {
      setImagePath(`/images/Casas/${folder}/Bandeira-sem-fundo.png`);
    } else {
      setImagePath('/images/logo.png'); // Imagem padrão caso não encontre a casa
    }
  }, [theme.name]);

  // Configurar tamanhos baseados no prop size e na largura da tela
  const getBannerSize = () => {
    const isLarge = size === 'large';
    const isMedium = size === 'medium';
    
    if (windowWidth < 480) { // Telas muito pequenas
      return { 
        width: isLarge ? 100 : isMedium ? 80 : 70,
        height: isLarge ? 160 : isMedium ? 140 : 120,
        poleHeight: isLarge ? 180 : isMedium ? 160 : 140
      };
    }
    if (windowWidth < 640) { // Telas pequenas
      return { 
        width: isLarge ? 120 : isMedium ? 100 : 80,
        height: isLarge ? 180 : isMedium ? 160 : 140,
        poleHeight: isLarge ? 200 : isMedium ? 180 : 160
      };
    }
    if (windowWidth < 768) { // Tablets
      return { 
        width: isLarge ? 140 : isMedium ? 120 : 100, 
        height: isLarge ? 220 : isMedium ? 180 : 160,
        poleHeight: isLarge ? 240 : isMedium ? 200 : 180
      };
    }
    if (windowWidth < 1024) { // Telas médias
      return { 
        width: isLarge ? 150 : isMedium ? 130 : 110, 
        height: isLarge ? 230 : isMedium ? 190 : 170,
        poleHeight: isLarge ? 250 : isMedium ? 210 : 190
      };
    }
    // Telas grandes
    return { 
      width: isLarge ? 160 : isMedium ? 140 : 120, 
      height: isLarge ? 240 : isMedium ? 200 : 180,
      poleHeight: isLarge ? 260 : isMedium ? 220 : 200
    };
  };
  
  const { width, height, poleHeight } = getBannerSize();
  
  // Se não tiver imagem definida, mostrar versão estilizada
  const useStylizedBanner = !imagePath;
  
  // Obter a primeira letra do nome da casa (fallback para estilizado)
  const getHouseInitial = () => {
    return theme.name.charAt(0);
  };
  
  return (
    <motion.div 
      className="banner-container relative"
      style={{ 
        height: `${height}px`,
        width: `${width}px`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bandeira sem mastro */}
      <div 
        className="absolute top-0 left-0"
        style={{
          zIndex: 1,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Brilho dinâmico na bandeira - mantido */}
          <motion.div 
            className="absolute inset-0 z-10 banner-shine"
            style={{
              background: `linear-gradient(45deg, transparent 20%, ${theme.colors.primary}40 40%, ${theme.colors.secondary}30 60%, transparent 80%)`,
              backgroundSize: '200% 200%',
              borderRadius: '8px',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
          
          {/* Efeito de reflexo/luz diagonal */}
          <motion.div 
            className="absolute inset-0 z-20"
            style={{
              background: `linear-gradient(135deg, 
                transparent 25%, 
                rgba(255, 255, 255, 0.05) 35%, 
                rgba(255, 255, 255, 0.2) 50%, 
                rgba(255, 255, 255, 0.05) 65%, 
                transparent 75%)`,
              backgroundSize: '400% 400%',
              borderRadius: '8px',
              mixBlendMode: 'overlay',
              pointerEvents: 'none'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
          />
          
          {/* Sombra da bandeira */}
          <div 
            className="absolute inset-0 rounded-lg banner-shadow"
            style={{
              boxShadow: `inset 3px 3px 10px rgba(0,0,0,0.3)`,
              borderRadius: '8px',
              zIndex: 1
            }}
          />
          
          {/* Bandeira com imagem ou estilizada */}
          <div 
            className="w-full h-full relative rounded-lg overflow-hidden z-0 flex items-center justify-center"
            style={{
              backgroundImage: useStylizedBanner ? `linear-gradient(135deg, ${theme.colors.primary}80, ${theme.colors.background}90)` : 'none',
              borderRadius: '8px',
              boxShadow: '2px 2px 15px rgba(0,0,0,0.4)',
              border: `1px solid ${theme.colors.secondary}50`,
            }}
          >
            {useStylizedBanner ? (
              // Versão estilizada sem imagem
              <div 
                className="font-bold text-center flex flex-col items-center justify-center"
                style={{ 
                  color: theme.colors.text,
                  textShadow: `0 2px 4px rgba(0,0,0,0.5)`
                }}
              >
                <div className="text-4xl sm:text-5xl mb-2">{getHouseInitial()}</div>
                
                {/* Símbolos decorativos - ajustados para responsividade */}
                <div className="flex space-x-2 sm:space-x-4 mt-2 sm:mt-4">
                  <div 
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="h-6 w-6 sm:h-8 sm:w-8 transform rotate-45"
                    style={{ backgroundColor: theme.colors.tertiary }}
                  />
                  <div 
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
            ) : (
              // Versão com imagem
              <div className="w-full h-full p-2">
                <Image 
                  src={imagePath}
                  alt={`Bandeira da casa ${theme.name}`}
                  width={width - 8}
                  height={height - 8}
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HouseBanner; 