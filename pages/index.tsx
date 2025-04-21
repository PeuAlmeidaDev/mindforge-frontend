import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Home: NextPage = () => {
  // Estado para controlar erros de carregamento de imagens
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  // Estado para controlar qual casa está selecionada
  const [selectedHouse, setSelectedHouse] = useState<number>(0);

  // Dados das casas
  const houses = [
    {
      id: 0,
      name: "FLOR DO ESPÍRITO DOURADO",
      image: "/images/Casas/FlorDoEspiritoDourado/bandeira.jpg",
      description: "Uma casa focada em sabedoria e crescimento interno. Seus membros valorizam meditação, estudos e o equilíbrio entre mente e corpo. São conhecidos por sua paciência e capacidade de encontrar soluções criativas para problemas complexos."
    },
    {
      id: 1,
      name: "ORDEM DAS TRÊS FACES",
      image: "/images/Casas/OrdemDasTresFaces/bandeira.jpg",
      description: "Uma casa que abraça a multiplicidade e adaptabilidade. Seus membros cultivam diferentes facetas de sua personalidade, sendo versáteis e capazes de se adaptar a diversas situações. São excelentes estrategistas e comunicadores."
    },
    {
      id: 2,
      name: "ALMA DAS ÁGUAS FLAMEJANTES",
      image: "/images/Casas/AlmaDasAguasFlamejantes/bandeira.jpg",
      description: "Uma casa que harmoniza elementos opostos. Seus membros buscam o equilíbrio entre emoção e razão, caos e ordem. São profundos em seus sentimentos mas disciplinados em suas ações, criando uma força única e transformadora."
    },
    {
      id: 3,
      name: "CHAMAS DO RUGIDO",
      image: "/images/Casas/ChamasDoRugido/bandeira.png",
      description: "Uma casa focada em força e coragem. Seus membros são destemidos e apaixonados, sempre prontos para enfrentar desafios com garra e determinação. Valorizam a lealdade e a proteção dos mais fracos."
    },
    {
      id: 4,
      name: "KAZOKU NO OKAMI",
      image: "/images/Casas/KazokuNoOkami/bandeira.png",
      description: "Uma casa que prioriza a união e o trabalho em equipe. Inspirados pela força da matilha, seus membros valorizam a família e os laços comunitários. São leais, protetores e acreditam que juntos são mais fortes."
    }
  ];

  // Função para lidar com erros de carregamento de imagens
  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Head>
        <title>MindForge - Forje sua mente, conquiste seus objetivos</title>
        <meta name="description" content="MindForge - Transforme hábitos em poder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 z-50 bg-[#01251a]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#FFD700]" style={{ 
            fontFamily: '"Cinzel", "Trajan Pro", serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>MINDFORGE</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#sobre" className="hover:text-[#C5E8D5] transition-colors">
              Sobre
            </Link>
            <Link href="#metas" className="hover:text-[#C5E8D5] transition-colors">
              Metas
            </Link>
            <Link href="#batalhas" className="hover:text-[#C5E8D5] transition-colors">
              Batalhas
            </Link>
            <Link href="#casas" className="hover:text-[#C5E8D5] transition-colors">
              Casas
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Link href="/login" className="px-4 py-2 text-sm border border-[#215E45] rounded-md hover:bg-[#215E45]/30 transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-[#215E45] rounded-md hover:bg-[#215E45]/80 transition-colors">
              Registrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Banner Principal */}
        <section className="relative h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="relative w-full h-full">
              <Image 
                src="/images/Index/BannerPrincipal.png"
                alt="Banner Principal Mindforge"
                fill
                priority={true}
                quality={100}
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-start justify-center h-full">
            <h1 className="text-5xl md:text-7xl font-bold text-[#FFD700] mb-4">MINDFORGE</h1>
            <p className="text-2xl md:text-3xl font-semibold mb-3">Forje sua mente, conquiste seus objetivos</p>
            <p className="text-xl mb-8 text-[#C5E8D5]">Transforme hábitos em poder</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="px-6 py-3 bg-[#215E45] text-white rounded-md hover:bg-[#0B3D2D] transition-all transform hover:scale-105 text-center">
                COMECE AGORA
              </Link>
              <Link href="#sobre" className="px-6 py-3 border border-[#215E45] text-white rounded-md hover:bg-[#215E45]/20 transition-all text-center">
                SAIBA MAIS
              </Link>
            </div>
          </div>
        </section>

        {/* O que é Mindforge */}
        <section id="sobre" className="py-20 bg-[#0B3D2D]/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#FFD700]">
              O QUE É MINDFORGE?
            </h2>
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              <div className="max-w-3xl text-center md:text-left">
                <p className="text-xl mb-6">
                  MindForge é um app que transforma seus hábitos diários em poder para batalhas em um mundo de fantasia.
                </p>
                
                <ul className="text-left space-y-2 text-[#C5E8D5]">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Crie e acompanhe metas diárias baseadas em seus interesses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Ganhe atributos e habilidades ao completar seus objetivos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Participe de batalhas estratégicas em turnos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Junte-se a uma casa com outros jogadores semelhantes a você</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Evolua constantemente e desbloqueie novos poderes</span>
                  </li>
                </ul>
              </div>
              
              <div className="w-full h-80 relative rounded-lg overflow-hidden">
                <Image 
                  src="/images/Index/Resumo do Projeto/LogoResumoDoProjeto.png"
                  alt="Resumo do Projeto Mindforge"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            
            <div className="bg-[#121212]/50 p-8 rounded-lg max-w-3xl mx-auto mt-16">
              <h3 className="text-2xl text-center mb-4 font-medium italic text-[#FFD700]">
                "A verdadeira batalha acontece dentro de você"
              </h3>
              <p className="text-center text-[#C5E8D5]">
                O MindForge não verifica se você realmente cumpriu suas metas.
                Essa jornada é sobre sua própria evolução e compromisso.
                O poder de transformar hábitos em conquistas está em suas mãos.
              </p>
            </div>
          </div>
        </section>

        {/* Sistema de Metas */}
        <section id="metas" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-[#FFD700]">
              SISTEMA DE METAS E INTERESSES
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden">
                    <Image 
                      src="/images/Index/sistemasDeMetas/metas.png"
                      alt="Metas Diárias"
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">METAS DIÁRIAS</h3>
                
                <ul className="space-y-2 text-[#C5E8D5]">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>5 metas fixas diárias</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>1 meta opcional bônus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Baseadas nos seus interesses pessoais</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Recompensas de atributos para cada meta concluída</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden">
                    <Image 
                      src="/images/Index/sistemasDeMetas/Interesses.png"
                      alt="Interesses Personalizados"
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">INTERESSES PERSONALIZADOS</h3>
                
                <ul className="space-y-2 text-[#C5E8D5]">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Escolha seus interesses (estudos, exercícios, meditação, artes...)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Receba metas relevantes para o que você gosta</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Personalize sua jornada de evolução</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Desenvolva hábitos alinhados com seus objetivos pessoais</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden">
                    <Image 
                      src="/images/Index/sistemasDeMetas/atributos.png"
                      alt="Atributos em Evolução"
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">ATRIBUTOS EM EVOLUÇÃO</h3>
                
                <ul className="space-y-2 text-[#C5E8D5]">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Ganhe pontos de vida</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Aumente ataque físico e especial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Melhore defesa física e especial</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Aumente sua velocidade</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 relative rounded-full overflow-hidden">
                    <Image 
                      src="/images/Index/sistemasDeMetas/evolução.png"
                      alt="Progresso Constante"
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-center">PROGRESSO CONSTANTE</h3>
                
                <ul className="space-y-2 text-[#C5E8D5]">
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Acompanhe seu histórico de metas completas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Visualize seu crescimento em gráficos e estatísticas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Receba recomendações personalizadas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-[#FFD700]">•</span> 
                    <span>Acompanhe seus ciclos de produtividade</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sistema de Batalha */}
        <section id="batalhas" className="py-20 bg-[#0B3D2D]/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#FFD700]">
              BATALHAS ESTRATÉGICAS EM TURNOS
            </h2>
            
            <div className="max-w-5xl mx-auto relative">
              <div className="w-full h-64 md:h-80 relative rounded-xl mb-10 overflow-hidden">
                <Image 
                  src="/images/Index/SistemaDeBatalhas/bannerBatalha.png"
                  alt="Sistema de Batalha"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 90vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Batalhas PVE (1x1, 3x3, 1x5) para treinar suas habilidades</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Batalhas PVP (1x1, 3x3) para desafiar outros jogadores</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Sistema de elementos com vantagens e desvantagens</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Habilidades estratégicas com efeitos especiais</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Buffs, debuffs e efeitos de status</p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-[#FFD700] mr-2">•</span>
                    <p>Quanto mais você cumpre suas metas, mais forte se torna!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recompensas e Progressão */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#FFD700]">
              EVOLUA E SEJA RECOMPENSADO
            </h2>
            
            <div className="w-full max-h-64 mb-12 relative rounded-xl overflow-hidden">
              <Image 
                src="/images/Index/RecompensaEProgressao/BannerProgressao.png"
                alt="Recompensas e Progressão"
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 90vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
            
            {/* Imagem decorativa adicional */}
            <div className="max-w-xl mx-auto mb-12 p-4 bg-[#0B3D2D]/30 rounded-lg">
              <div className="w-full h-64 relative rounded-xl overflow-hidden">
                <Image 
                  src="/images/Index/RecompensaEProgressao/BannerProgressao.png"
                  alt="Evolução Contínua"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 90vw, 40vw"
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: '0 25%',
                    filter: 'brightness(1.1) contrast(1.1)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D2D]/80 to-transparent flex items-end justify-center p-6">
                  <p className="text-xl font-medium text-[#FFD700] text-center">
                    "O progresso constante é a chave para o sucesso"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="text-4xl text-[#FFD700] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">EXPERIÊNCIA E NÍVEIS</h3>
                <p className="text-[#C5E8D5]">Ganhe XP e suba de nível, desbloqueando novos poderes</p>
              </div>
              
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="text-4xl text-[#FFD700] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">DUPLO TIPO ELEMENTAL</h3>
                <p className="text-[#C5E8D5]">Desbloqueie um segundo tipo elemental no nível 10</p>
              </div>
              
              <div className="bg-[#0B3D2D]/20 p-6 rounded-lg border border-[#215E45]/30 hover:border-[#215E45] transition-colors">
                <div className="text-4xl text-[#FFD700] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">RANKING E RECOMPENSAS</h3>
                <p className="text-[#C5E8D5]">Ganhe emblemas exclusivos e suba no ranking</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sistema de Casas */}
        <section id="casas" className="py-20 bg-[#0B3D2D]/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-[#FFD700]">
              ENCONTRE SUA CASA
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Menu lateral com botões das casas */}
              <div className="w-full md:w-1/4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {houses.map((house, index) => (
                  <button
                    key={house.id}
                    onClick={() => setSelectedHouse(index)}
                    className={`p-3 md:p-4 text-left rounded-lg transition-all flex items-center ${
                      selectedHouse === index 
                        ? 'bg-[#215E45] text-white border-l-4 border-[#FFD700]' 
                        : 'bg-[#121212] text-white hover:bg-[#121212]/80'
                    }`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 relative rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image 
                        src={house.image}
                        alt={house.name}
                        fill
                        quality={100}
                        sizes="40px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className="text-sm md:text-base font-medium">{house.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Conteúdo detalhado da casa selecionada */}
              <div className="w-full md:w-3/4">
                <div className="bg-[#121212]/50 p-4 md:p-6 rounded-lg">
                  <div className="w-full h-80 md:h-[32rem] relative rounded-lg overflow-hidden mb-6">
                    <Image 
                      src={houses[selectedHouse].image}
                      alt={houses[selectedHouse].name}
                      fill
                      quality={100}
                      sizes="(max-width: 768px) 100vw, 75vw"
                      style={{ objectFit: 'contain' }}
                    />
                    {/* Gradiente sobreposto para melhor legibilidade do título */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
                    
                    {/* Título da casa */}
                    <div className="absolute bottom-0 left-0 w-full p-4 md:p-6">
                      <h3 className="text-xl md:text-3xl font-bold text-[#FFD700]">
                        {houses[selectedHouse].name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Descrição da casa */}
                  <div className="mb-6">
                    <p className="text-[#C5E8D5] text-base md:text-lg">
                      {houses[selectedHouse].description}
                    </p>
                  </div>
                  
                  {/* Características da casa - lista genérica */}
                  <ul className="space-y-2 text-[#C5E8D5]">
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <p>Seja designado a uma casa com base em seus interesses</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <p>Participe de desafios e metas coletivas</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <p>Contribua para o ranking da sua casa</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <p>Customize seu perfil com os temas da sua casa</p>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FFD700] mr-2">•</span>
                      <p>Colabore com outros membros em batalhas especiais</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chamada para Ação */}
        <section className="py-24 bg-gradient-to-b from-[#0B3D2D] to-[#121212]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FFD700]">
              COMECE SUA JORNADA HOJE
            </h2>
            
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Transforme seus hábitos em poder e construa a melhor versão de você mesmo.
            </p>
            
            <Link href="/register" className="inline-block px-8 py-4 bg-[#215E45] text-white text-lg font-bold rounded-md hover:bg-[#215E45]/80 transition-all transform hover:scale-105 mb-4">
              CRIAR CONTA
            </Link>
            
            <div className="mt-4">
              <span className="text-[#C5E8D5]">Já tem uma conta? </span>
              <Link href="/login" className="text-[#FFD700] hover:underline">
                Fazer Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#121212] py-8 border-t border-[#215E45]/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFD700] mb-6">MINDFORGE</div>
            <p className="text-[#C5E8D5] mb-4">Forje sua mente, conquiste seus objetivos</p>
            <p className="text-gray-500">&copy; 2023 MindForge. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 