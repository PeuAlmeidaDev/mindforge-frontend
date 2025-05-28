import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    token: string;
    user: any;
  };
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');
    setAuthError('');

    try {
      await login(email, password);
      // O redirecionamento é feito dentro da função login
    } catch (error: any) {
      console.error('Erro no login:', error);
      setApiError(error.message || 'Erro ao conectar ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Mindforge</title>
        <meta name="description" content="Entre na sua conta Mindforge" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image 
              src="/images/logo.png" 
              alt="Mindforge Logo" 
              width={150} 
              height={150}
              className="rounded-lg"
            />
          </motion.div>
          
          <motion.div 
            className="bg-black/40 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-green-900/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h1 
              className="text-2xl font-bold text-green-400 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Entrar
            </motion.h1>
            
            {(apiError || authError) && (
              <motion.div 
                className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {apiError || authError}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-green-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-green-900/50 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500 transition"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-green-400 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-green-900/50 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500 transition"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700 transition ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-green-200">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-green-400 hover:text-green-300 hover:underline">
                  Criar Conta
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 