import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começa a corrigir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      await login(formData.email, formData.password);
      // Redirecionamento é feito dentro da função login
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado');
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
      
      <div className="min-h-screen bg-[#060d08] flex flex-col justify-center items-center p-4 sm:p-6">
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
            
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    when: "beforeChildren"
                  }
                }
              }}
            >
              {/* Campo de usuário oculto para acessibilidade */}
              <input 
                type="text" 
                name="username" 
                id="username"
                autoComplete="username"
                aria-hidden="true"
                style={{ display: 'none' }}
              />
              
              <motion.div 
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
                }}
              >
                <label htmlFor="email" className="block text-green-300 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded bg-black/60 border ${errors.email ? 'border-red-500' : 'border-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </motion.div>
              
              <motion.div 
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
                }}
              >
                <label htmlFor="password" className="block text-green-300 mb-1">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded bg-black/60 border ${errors.password ? 'border-red-500' : 'border-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                  autoComplete="current-password"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full py-2 px-4 bg-green-700 hover:bg-green-600 text-white font-medium rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading || authLoading ? 'Entrando...' : 'Entrar'}
              </motion.button>
            </motion.form>
            
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