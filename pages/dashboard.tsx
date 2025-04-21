import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    // Redirecionar para login se não estiver autenticado e não estiver carregando
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Exibir tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1f0a] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-green-400">Carregando...</p>
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
        <title>Dashboard | Mindforge</title>
        <meta name="description" content="Gerencie sua jornada no Mindforge" />
      </Head>

      <div className="min-h-screen bg-[#0a1f0a]">
        {/* Cabeçalho */}
        <header className="bg-black/60 border-b border-green-900/50 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image 
                src="/images/logo.jpg" 
                alt="Mindforge Logo" 
                width={50} 
                height={50}
                className="rounded-lg"
              />
              <h1 className="text-green-400 text-xl font-bold">Mindforge</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.username}</p>
                <p className="text-green-400 text-sm">Nível {user?.level}</p>
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
          <div className="bg-black/40 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-green-900/50">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Bem-vindo, {user?.username}!</h2>
            
            <div className="mb-6">
              <h3 className="text-xl text-green-300 mb-2">Seu Perfil</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg border border-green-900/30">
                  <p className="text-white"><span className="text-green-400">Email:</span> {user?.email}</p>
                  <p className="text-white"><span className="text-green-400">Tipo Elemental:</span> {user?.primaryElementalType}</p>
                  <p className="text-white"><span className="text-green-400">Casa:</span> {user?.house?.name}</p>
                  <p className="text-white"><span className="text-green-400">Experiência:</span> {user?.experience}</p>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-green-900/30">
                  <p className="text-green-400 mb-2">Atributos</p>
                  <ul className="space-y-1">
                    <li className="text-white text-sm">Vida: {user?.attributes?.health}</li>
                    <li className="text-white text-sm">Ataque Físico: {user?.attributes?.physicalAttack}</li>
                    <li className="text-white text-sm">Ataque Especial: {user?.attributes?.specialAttack}</li>
                    <li className="text-white text-sm">Defesa Física: {user?.attributes?.physicalDefense}</li>
                    <li className="text-white text-sm">Defesa Especial: {user?.attributes?.specialDefense}</li>
                    <li className="text-white text-sm">Velocidade: {user?.attributes?.speed}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <p className="text-yellow-400 italic">Esta página será expandida com mais funcionalidades em breve.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 