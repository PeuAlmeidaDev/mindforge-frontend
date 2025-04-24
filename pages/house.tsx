import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import HeaderSection from '../components/dashboard/HeaderSection';
import LoadingScreen from '../components/dashboard/LoadingScreen';

export default function HousePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useHouseTheme();
  const [founderImageError, setFounderImageError] = useState(false);
  
  // Dados da casa baseados no usuário
  const houseId = user?.house?.id || '';
  const hasHouse = Boolean(user && user.house && user.house.name);
  const houseName = user?.house?.name || 'Sem Casa';

  // Converter o nome da casa para o formato da pasta
  const getHouseFolder = () => {
    if (!hasHouse) return '';
    
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
  const lugarImagePath = houseFolder 
    ? `/images/Casas/${houseFolder}/lugar.png` 
    : '/images/Index/BannerPrincipal.png';

  const getFounderImagePath = () => {
    if (!houseFolder) return '/images/placeholder-avatar.png';
    
    // Tenta primeiro JPG, com fallback para PNG
    return founderImageError 
      ? `/images/Casas/${houseFolder}/fundador.png`  
      : `/images/Casas/${houseFolder}/fundador.jpg`;
  };

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
    
    // Redirecionar para o dashboard se não tiver casa
    if (isAuthenticated && !hasHouse && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, hasHouse]);

  // Animações para os elementos da página
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Exibir tela de carregamento enquanto verifica autenticação
  if (isLoading || !isAuthenticated || !hasHouse) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <>
      <Head>
        <title>{houseName} | Mindforge</title>
        <meta name="description" content={`Conheça a casa ${houseName} no Mindforge`} />
      </Head>

      <DashboardLayout theme={theme}>
        {/* Header e Banner + Barra de Menu */}
        <HeaderSection 
          theme={theme} 
          user={user} 
          houseName={houseName} 
          hasHouse={hasHouse} 
          houseId={houseId}
        />
        
        {/* Espaçamento adicional após o header */}
        <div className="h-8 md:h-12"></div>
        
        {/* Hero Section com imagem de fundo e título */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          className="relative w-full h-[50vh] md:h-[60vh] max-w-6xl mx-auto overflow-hidden mt-4 md:mt-8"
        >
          {/* Moldura elegante */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20"></div>
          <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent z-20"></div>
          <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent z-20"></div>
          
          {/* Elementos decorativos sutis nos cantos */}
          <motion.div 
            className="absolute top-4 left-4 w-8 h-8 z-20"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderLeft: '1px solid rgba(255,255,255,0.3)'
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-4 right-4 w-8 h-8 z-20"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.3)',
              borderRight: '1px solid rgba(255,255,255,0.3)'
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-4 left-4 w-8 h-8 z-20"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              borderLeft: '1px solid rgba(255,255,255,0.3)'
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-4 right-4 w-8 h-8 z-20"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              borderRight: '1px solid rgba(255,255,255,0.3)'
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={lugarImagePath}
              alt={`Sede da casa ${houseName}`}
              fill
              priority
              sizes="100vw"
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            <div 
              className="absolute inset-0"
              style={{ 
                background: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, ${theme.colors.backgroundDark}E6 100%)`
              }}
            />
          </div>

          {/* Título Estilizado */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <motion.div
              variants={titleVariants}
              className="text-center px-4"
            >
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-wider"
                style={{ 
                  color: theme.colors.primary,
                  textShadow: `0 0 15px ${theme.colors.backgroundDark}, 0 0 25px ${theme.colors.backgroundDark}, 2px 2px 3px rgba(0,0,0,0.9)`
                }}
              >
                {houseName}
              </h1>
              
              {/* Decoração do título - mais elegante */}
              <div className="relative w-40 md:w-60 h-0.5 mx-auto">
                <motion.div 
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${theme.colors.primary}50, transparent)`
                  }}
                />
                <motion.div 
                  className="absolute inset-0 w-1/2 left-1/4"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`
                  }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Conteúdo principal */}
        <motion.main 
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="px-4 py-8 w-full max-w-6xl mx-auto relative z-10"
        >
          <div 
            className="rounded-xl p-6 md:p-8 shadow-2xl mt-12"
            style={{ 
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.primary}40`,
              boxShadow: `0 10px 30px -10px ${theme.colors.backgroundDark}`
            }}
          >
            {/* Seção de apresentação da casa com brasão e descrição */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-10">
              {/* Brasão da casa */}
              <motion.div 
                className="flex-shrink-0 mx-auto md:mx-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <div 
                  className="relative w-40 h-40 md:w-64 md:h-64 overflow-hidden"
                  style={{ 
                    background: `radial-gradient(circle, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
                    border: `1px solid ${theme.colors.primary}40`,
                    boxShadow: `0 5px 20px -5px ${theme.colors.primary}30`
                  }}
                >
                  <Image
                    src={`/images/Casas/${houseFolder}/brasao.png`}
                    alt={`Brasão da casa ${houseName}`}
                    fill
                    style={{ objectFit: 'contain', padding: '12px' }}
                  />
                  
                  {/* Brilho decorativo */}
                  <motion.div 
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${theme.colors.primary}20 0%, transparent 60%)`,
                      mixBlendMode: 'overlay'
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
              
              {/* Descrição da casa */}
              <motion.div 
                className="flex-grow space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
              >
                <h2 
                  className="text-2xl md:text-3xl font-bold text-center md:text-left"
                  style={{ color: theme.colors.primary }}
                >
                  História da Casa
                </h2>
                
                <div 
                  className="prose prose-lg max-w-none"
                  style={{ color: theme.colors.text }}
                >
                  {getHouseDescription(theme.name)}
                </div>
              </motion.div>
            </div>
            
            {/* Seção do Fundador da Casa */}
            <div className="mt-16 mb-12 border-t border-b py-10" style={{ borderColor: `${theme.colors.primary}30` }}>
              <h2 
                className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left"
                style={{ color: theme.colors.primary }}
              >
                História do Fundador
              </h2>
              
              <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
                {/* Texto do Fundador - Lado Esquerdo */}
                <motion.div 
                  className="flex-grow space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <div 
                    className="prose prose-lg max-w-none"
                    style={{ color: theme.colors.text }}
                  >
                    <p>Os fundadores das casas são figuras lendárias que personificam os valores e ideais de suas respectivas tradições.</p>
                    <p>Através de feitos extraordinários e sabedoria ancestral, eles estabeleceram as bases filosóficas e práticas que definem cada casa até hoje.</p>
                    <p>Suas histórias inspiram gerações de discípulos a seguirem seus passos, buscando a excelência e o aperfeiçoamento constante.</p>
                    <p>O legado do fundador vive em cada membro da casa, que carrega consigo a responsabilidade de honrar e perpetuar seus ensinamentos.</p>
                  </div>
                </motion.div>
                
                {/* Imagem do Fundador - Lado Direito */}
                <motion.div 
                  className="flex-shrink-0 mx-auto md:mx-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <div 
                    className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-full"
                    style={{ 
                      boxShadow: `0 5px 20px -5px ${theme.colors.primary}70`,
                      border: `3px solid ${theme.colors.primary}40`,
                    }}
                  >
                    <Image
                      src={getFounderImagePath()}
                      alt={`Fundador da casa ${houseName}`}
                      fill
                      style={{ 
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      onError={() => {
                        if (!founderImageError) {
                          setFounderImageError(true);
                        }
                      }}
                    />
                    
                    {/* Efeito de brilho */}
                    <div 
                      className="absolute inset-0 z-10"
                      style={{ 
                        background: `linear-gradient(135deg, transparent 40%, ${theme.colors.primary}30 50%, transparent 60%)`,
                        mixBlendMode: 'overlay'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            
            <h2 
              className="text-2xl md:text-3xl font-bold mb-4 mt-12 text-center md:text-left"
              style={{ color: theme.colors.primary }}
            >
              Atividades da Casa
            </h2>
            
            <p 
              className="mb-6 text-lg"
              style={{ color: theme.colors.text }}
            >
              Acompanhe as atividades, conquistas e eventos relacionados à sua casa.
            </p>
            
            {/* Espaço para conteúdo adicional a ser implementado */}
            <div className="mt-10 h-48 flex items-center justify-center">
              <p 
                className="text-center text-lg italic"
                style={{ color: `${theme.colors.text}80` }}
              >
                Mais informações detalhadas sobre sua casa estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </motion.main>
      </DashboardLayout>
    </>
  );
}

// Função para obter a descrição específica da casa
function getHouseDescription(houseName: string): JSX.Element {
  switch (houseName) {
    case 'Flor do Espírito Dourado':
      return (
        <>
          <p>Em um campo onde pétalas flutuam no vento e estrelas se curvam para ouvir histórias, brilha a luz sutil da Casa do Espírito Dourado.</p>
          <p>Nascida de uma deusa das eras esquecidas, esta casa cultiva o equilíbrio entre beleza, sabedoria e intenção. A raposa dourada, símbolo da inteligência sagrada, guia os caminhos sutis da alma desperta.</p>
          <p>Os escolhidos são jardineiros do mundo: transformam hábitos em flores, ações em arte, e decisões em ouro espiritual.</p>
          <p>Se você busca conhecer a si mesmo e criar com propósito, a raposa já sussurrou seu nome nos ventos.</p>
        </>
      );
    case 'Ordem das Três Faces':
      return (
        <>
          <p>Nos salões espelhados da noite eterna, onde passado, presente e futuro dançam em uníssono, resplandece a sabedoria da Casa das Três Faces.</p>
          <p>A Grande Oráculo, uma mulher que carrega em si as três faces da lua — a Jovem, a Mãe e a Anciã — guia seus seguidores através do labirinto do conhecimento e da alma. Ao seu lado, um gato cósmico vigia os portais do tempo.</p>
          <p>Esta casa busca aqueles que contemplam o invisível, que aprendem com as cicatrizes e que moldam o destino com mente desperta. Se você sente que há mais camadas na realidade, a Tríade te observa com olhos lunares.</p>
        </>
      );
    case 'Alma das Águas Flamejantes':
      return (
        <>
          <p>Na confluência mágica entre rios encantados e florestas vivas, onde o fogo dança sobre a água, vive a lenda da Casa das Águas Flamejantes. Protetores do fluxo da vida e da criatividade, eles combinam paixão e fluidez em sua essência.</p>
          <p>Fundada por Iara, a encantadora das profundezas, e protegida pela fúria serpenteante do Boitatá, esta casa abriga espíritos livres, intensos e criadores. Seus rituais misturam canto, pintura, dança — e chamas.</p>
          <p>Aqueles guiados por emoções vívidas e causas nobres, que se expressam com coragem e beleza, sentem o chamado do fogo nas águas. A arte aqui é sagrada — e viva.</p>
        </>
      );
    case 'Chamas do Rugido':
      return (
        <>
          <p>Na savana ardente onde o sol toca o chão com raiva, ergue-se a tribo invicta da Casa das Chamas do Rugido. Uma casa de ritmo, resistência e justiça.</p>
          <p>Fundada por um guerreiro de espírito indomável e palavras que ecoavam como trovões, ele dançava entre a chama e a batalha, guiado pela batida do tambor ancestral. Sua juba era símbolo de conexão e sabedoria.</p>
          <p>Os filhos dessa casa têm o coração em chamas — lutam, protegem, cantam e jamais se dobram. Aqueles que querem transformar dor em fogo e movimento em força encontram no leão seu reflexo.</p>
        </>
      );
    case 'Kazoku no Okami':
      return (
        <>
          <p>No extremo norte das Terras Celestes, onde as nevascas sussurram segredos antigos, ergue-se a fortaleza glacial da Casa do Lobo. Forjados em silêncio e honra, seus membros seguem o código do lobo: lealdade, disciplina e superação.</p>
          <p>O Kazoku no Okami, o samurai ancestral, foi o primeiro a dominar a arte do "Gelo Interior" — um poder que congela as dúvidas e cristaliza a força de vontade. Dizem que seus olhos viam o caminho mais puro, mesmo na tempestade mais densa.</p>
          <p>A Casa observa aqueles que treinam corpo e mente com a mesma seriedade, e que enfrentam seus próprios limites como guerreiros silenciosos. Se você busca força através da disciplina, o Lobo pode estar te vigiando.</p>
        </>
      );
    default:
      return <p>Informações sobre esta casa serão reveladas em breve.</p>;
  }
} 