import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { theme } = useHouseTheme();

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado e não estiver carregando
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Exibir tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center"
        style={{ backgroundColor: theme.colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: theme.colors.primary }}></div>
        <p className="mt-4" style={{ color: theme.colors.primary }}>Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, não exibe nada (será redirecionado pelo useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{user?.house?.name ? `${user.house.name} | Mindforge` : 'Dashboard | Mindforge'}</title>
        <meta name="description" content="Gerencie sua jornada no Mindforge" />
      </Head>

      <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
        {/* Cabeçalho */}
        <header className="backdrop-blur-sm p-4 border-b"
          style={{ 
            backgroundColor: `${theme.colors.background}99`,
            borderColor: theme.colors.primary
          }}>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image 
                  src={theme.flagImage}
                  alt="Casa Logo" 
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/logo.jpg';
                  }}
                />
              </div>
              <h1 className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                {user?.house?.name || 'Mindforge'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium" style={{ color: theme.colors.text }}>{user?.username}</p>
                <p className="text-sm" style={{ color: theme.colors.secondary }}>Nível {user?.level}</p>
              </div>
              <button 
                onClick={logout}
                className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-white rounded text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="container mx-auto p-4 sm:p-6">
          <div className="backdrop-blur-sm rounded-lg shadow-lg p-6 border"
            style={{ 
              backgroundColor: `${theme.colors.background}88`,
              borderColor: `${theme.colors.primary}50`
            }}>
            <h2 className="text-2xl font-bold mb-6" 
              style={{ color: theme.colors.primary }}>
              Bem-vindo, {user?.username}!
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl mb-2" 
                style={{ color: theme.colors.secondary }}>
                Seu Perfil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border" 
                  style={{ 
                    backgroundColor: `${theme.colors.background}cc`,
                    borderColor: `${theme.colors.primary}30`
                  }}>
                  <p style={{ color: theme.colors.text }}>
                    <span style={{ color: theme.colors.primary }}>Email:</span> {user?.email}
                  </p>
                  <p style={{ color: theme.colors.text }}>
                    <span style={{ color: theme.colors.primary }}>Tipo Elemental:</span> {user?.primaryElementalType}
                  </p>
                  <p style={{ color: theme.colors.text }}>
                    <span style={{ color: theme.colors.primary }}>Casa:</span> {user?.house?.name}
                  </p>
                  <p style={{ color: theme.colors.text }}>
                    <span style={{ color: theme.colors.primary }}>Experiência:</span> {user?.experience}
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: `${theme.colors.background}cc`,
                    borderColor: `${theme.colors.primary}30`
                  }}>
                  <p className="mb-2" style={{ color: theme.colors.primary }}>Atributos</p>
                  <ul className="space-y-1">
                    <li className="text-sm" style={{ color: theme.colors.text }}>Vida: {user?.attributes?.health}</li>
                    <li className="text-sm" style={{ color: theme.colors.text }}>Ataque Físico: {user?.attributes?.physicalAttack}</li>
                    <li className="text-sm" style={{ color: theme.colors.text }}>Ataque Especial: {user?.attributes?.specialAttack}</li>
                    <li className="text-sm" style={{ color: theme.colors.text }}>Defesa Física: {user?.attributes?.physicalDefense}</li>
                    <li className="text-sm" style={{ color: theme.colors.text }}>Defesa Especial: {user?.attributes?.specialDefense}</li>
                    <li className="text-sm" style={{ color: theme.colors.text }}>Velocidade: {user?.attributes?.speed}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <p style={{ color: theme.colors.accent }}>
                Esta página será expandida com mais funcionalidades em breve.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 