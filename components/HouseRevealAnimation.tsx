import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';

interface HouseRevealAnimationProps {
  onComplete: () => void;
}

export default function HouseRevealAnimation({ onComplete }: HouseRevealAnimationProps) {
  const { user } = useAuth();
  const { theme } = useHouseTheme();
  const [animationStep, setAnimationStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  const houseName = user?.house?.name || 'Sem Casa';
  const houseId = user?.house?.id || '';
  
  // Formatar o nome da casa para o formato da pasta de imagem
  const getHouseFolder = () => {
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

  const houseFolder = getHouseFolder();
  const brasaoImagePath = houseFolder
    ? `/images/Casas/${houseFolder}/brasao.png`
    : '/images/logo.png';

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.5
      }
    }
  };

  const brasaoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 1.2, 
        delay: 1.2,
        ease: "easeOut"
      }
    }
  };

  const nameVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 2.5
      }
    }
  };

  const mottoVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        delay: 3.2
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  // Avançar a animação
  useEffect(() => {
    if (animationStep === 0) {
      // Mostrar botão de continuar após um pequeno atraso
      const showButtonTimer = setTimeout(() => setShowContinueButton(true), 2000);
      
      // Inicia a sequência de animação
      const timer1 = setTimeout(() => setAnimationStep(1), 3000);
      const timer2 = setTimeout(() => setAnimationStep(2), 6000);
      const timer3 = setTimeout(() => {
        setIsVisible(false);
        // Dar tempo para a animação de saída antes de chamar onComplete
        setTimeout(onComplete, 600);
      }, 9000);
      
      return () => {
        clearTimeout(showButtonTimer);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [animationStep, onComplete]);

  // Função para lidar com o clique no botão de continuar
  const handleContinue = () => {
    setIsVisible(false);
    // Dar tempo para a animação de saída antes de chamar onComplete
    setTimeout(onComplete, 600);
  };

  // Função para obter o lema da casa
  const getHouseMotto = () => {
    switch (theme.name) {
      case 'Flor do Espírito Dourado':
        return 'Sabedoria é a luz que ilumina o caminho';
      case 'Ordem das Três Faces':
        return 'Três olhares, uma visão';
      case 'Alma das Águas Flamejantes':
        return 'Do conflito nasce a harmonia';
      case 'Chamas do Rugido':
        return 'Nossa coragem ecoa pela eternidade';
      case 'Kazoku no Okami':
        return 'A força da matilha está em cada lobo';
      default:
        return 'Bem-vindo ao Mindforge';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            backgroundColor: theme.colors.backgroundDark,
            backgroundImage: `radial-gradient(circle at center, ${theme.colors.background}80 0%, ${theme.colors.backgroundDark} 70%)` 
          }}
        >
          {/* Partículas de energia fluindo */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  boxShadow: `0 0 8px 2px ${theme.colors.primary}`
                }}
                animate={{
                  x: [
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerWidth
                  ],
                  y: [
                    Math.random() * window.innerHeight,
                    Math.random() * window.innerHeight
                  ],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            ))}
          </div>

          {/* Conteúdo central da animação */}
          <div className="max-w-md mx-auto text-center z-10 px-6">
            {/* Título de boas-vindas */}
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-10"
              style={{ color: theme.colors.primary }}
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              Bem vindo à casa
            </motion.h1>
            
            {/* Brasão da Casa */}
            <motion.div 
              className="relative w-64 h-64 mx-auto mb-10"
              variants={brasaoVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src={brasaoImagePath}
                alt={`Brasão da casa ${houseName}`}
                fill
                style={{
                  objectFit: 'contain'
                }}
              />
              
              {/* Efeito de brilho ao redor do brasão */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: `0 0 50px 10px ${theme.colors.primary}70`
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </motion.div>

            {/* Nome da Casa */}
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: theme.colors.secondary }}
              variants={nameVariants}
              initial="hidden"
              animate="visible"
            >
              {houseName}
            </motion.h2>

            {/* Lema da Casa */}
            {animationStep >= 2 && (
              <motion.p 
                className="text-xl md:text-2xl font-light italic mt-6"
                style={{ color: theme.colors.primary }}
                variants={mottoVariants}
                initial="hidden"
                animate="visible"
              >
                "{getHouseMotto()}"
              </motion.p>
            )}
            
            {/* Botão de continuar */}
            {showContinueButton && (
              <motion.div 
                className="mt-12"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  onClick={handleContinue}
                  className="px-8 py-3 rounded-md text-lg font-medium transition-all duration-200 transform hover:scale-105"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.backgroundDark,
                    boxShadow: `0 0 15px ${theme.colors.primary}70`
                  }}
                >
                  Continuar
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 