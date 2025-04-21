import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import useAuth from '../hooks/useAuth';
import useInterests, { Interest } from '../hooks/useInterests';
import ElementalTypeIcon from '../components/ElementalTypeIcon';
import { motion } from 'framer-motion';

// Definição dos tipos elementais válidos
const elementalTypes = [
  'fogo', 'água', 'terra', 'ar', 'luz', 'sombra', 'natureza',
  'elétrico', 'gelo', 'psíquico', 'fantasma', 'aço', 'veneno', 'voador', 'pedra'
];

// Mapeamento de tipos elementais de português para inglês
const elementalTypeMapping: Record<string, string> = {
  'fogo': 'FIRE',
  'água': 'WATER',
  'terra': 'EARTH',
  'ar': 'AIR',
  'luz': 'LIGHT',
  'sombra': 'DARK',
  'natureza': 'NORMAL',
  'elétrico': 'ELECTRIC',
  'gelo': 'ICE',
  'psíquico': 'PSYCHIC',
  'fantasma': 'GHOST',
  'aço': 'FAIRY',
  'veneno': 'POISON',
  'voador': 'DRAGON',
  'pedra': 'NORMAL'
};

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    } 
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export default function Register() {
  const router = useRouter();
  const { register, isLoading: authLoading, error: authError } = useAuth();
  const { interests, isLoading: interestsLoading, error: interestsError } = useInterests();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    primaryElementalType: '',
    interests: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Restaurar o estado do formulário do localStorage quando a página carrega
  useEffect(() => {
    const savedFormData = localStorage.getItem('register_form_data');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Erro ao recuperar dados do formulário:', error);
      }
    }
  }, []);

  // Salvar o estado do formulário no localStorage quando muda
  useEffect(() => {
    localStorage.setItem('register_form_data', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleElementalTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, primaryElementalType: type }));
    
    // Limpar erro quando o usuário seleciona um tipo
    if (errors.primaryElementalType) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.primaryElementalType;
        return newErrors;
      });
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      const index = interests.indexOf(interestId);
      
      if (index === -1) {
        // Adicionar interesse
        interests.push(interestId);
      } else {
        // Remover interesse
        interests.splice(index, 1);
      }
      
      return { ...prev, interests };
    });
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.username.trim()) {
        newErrors.username = 'Nome de usuário é obrigatório';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
    } 
    else if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }
    else if (currentStep === 3) {
      if (!formData.primaryElementalType) {
        newErrors.primaryElementalType = 'Escolha um tipo elemental';
      }
      
      if (formData.interests.length === 0) {
        newErrors.interests = 'Selecione pelo menos um interesse';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const validateForm = () => {
    // Checagens específicas para o passo final
    const newErrors: Record<string, string> = {};
    
    if (!formData.primaryElementalType) {
      newErrors.primaryElementalType = 'Escolha um tipo elemental';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Selecione pelo menos um interesse';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < totalSteps) {
      handleNextStep();
      return;
    }
    
    if (!validateCurrentStep()) return;
    
    setIsLoading(true);
    setApiError('');
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        primaryElementalType: elementalTypeMapping[formData.primaryElementalType] || formData.primaryElementalType,
        interests: formData.interests
      };
      
      await register(userData);
      // Limpar dados de registro do localStorage após sucesso
      localStorage.removeItem('register_form_data');
      // Redirecionamento é feito dentro da função register
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderiza o conteúdo do formulário de acordo com o passo atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step1"
            className="min-h-[250px]"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Informações Básicas</h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="username" className="block text-green-300 mb-1">Nome de Usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-black/60 border ${errors.username ? 'border-red-500' : 'border-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                autoFocus
                autoComplete="username"
              />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-4">
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
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step2"
            className="min-h-[250px]"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Segurança</h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-green-300 mb-1">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-black/60 border ${errors.password ? 'border-red-500' : 'border-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                autoFocus
                autoComplete="new-password"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-4">
              <label htmlFor="confirmPassword" className="block text-green-300 mb-1">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded bg-black/60 border ${errors.confirmPassword ? 'border-red-500' : 'border-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-green-500`}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </motion.div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="step3"
            className="min-h-[250px]"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl font-bold text-green-400 mb-4">Customize seu Perfil</h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label className="block text-green-300 mb-2">Tipo Elemental Primário</label>
              <div className={`grid grid-cols-3 sm:grid-cols-5 gap-3 p-3 bg-black/30 rounded border ${errors.primaryElementalType ? 'border-red-500' : 'border-green-900'}`}>
                {elementalTypes.map(type => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => handleElementalTypeChange(type)}
                    className={`flex flex-col items-center justify-center p-3 rounded transition-all duration-200 ${
                      formData.primaryElementalType === type 
                        ? 'bg-green-900/60 border border-green-500 transform scale-110 shadow-lg shadow-green-900/50' 
                        : 'bg-black/40 hover:bg-black/70 hover:scale-105 border border-transparent hover:border-green-800/50'
                    }`}
                    whileHover={{ scale: formData.primaryElementalType !== type ? 1.05 : 1.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ElementalTypeIcon type={type} size={36} showTooltip={true} className="mb-2" />
                    <span className="text-xs text-white capitalize">{type}</span>
                  </motion.button>
                ))}
              </div>
              {errors.primaryElementalType && (
                <p className="text-red-400 text-xs mt-1">{errors.primaryElementalType}</p>
              )}
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-6">
              <label className="block text-green-300 mb-2 text-base font-medium">Interesses</label>
              {interestsLoading ? (
                <div className="flex justify-center items-center p-6 bg-black/20 rounded-lg">
                  <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-green-300">Carregando interesses...</span>
                </div>
              ) : interestsError ? (
                <div className="bg-red-900/30 p-4 rounded-lg border border-red-800/50 text-red-200 text-sm mb-3">
                  <p>{interestsError}</p>
                  <p className="mt-1">Tente recarregar a página.</p>
                </div>
              ) : (
                <div className="bg-black/30 rounded-lg border border-green-900/50 overflow-hidden">
                  <div className="p-4 bg-green-900/20 border-b border-green-900/30">
                    <p className="text-sm text-green-200">Selecione os temas que mais combinam com seus objetivos de desenvolvimento pessoal</p>
                  </div>
                  
                  {interests.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      Nenhum interesse disponível
                    </div>
                  ) : (
                    <div className="p-4 flex flex-wrap gap-2.5 max-h-56 overflow-y-auto">
                      {interests.map((interest: Interest) => {
                        const isSelected = formData.interests.includes(interest.id);
                        
                        return (
                          <motion.button
                            key={interest.id}
                            type="button"
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`
                              rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                              ${isSelected 
                                ? 'bg-green-700 text-white shadow-md ring-1 ring-green-500' 
                                : 'bg-black/40 text-gray-300 hover:bg-black/60 hover:text-gray-200'}
                            `}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            {isSelected && (
                              <span className="inline-block mr-1.5 text-green-300">✓</span>
                            )}
                            {interest.name}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                  
                  {errors.interests && (
                    <div className="px-4 py-2 bg-red-900/20 border-t border-red-800/30">
                      <p className="text-red-400 text-xs">{errors.interests}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Registro | Mindforge</title>
        <meta name="description" content="Crie sua conta no Mindforge e comece sua jornada" />
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
              priority={true}
            />
          </motion.div>
          
          <motion.div 
            className="bg-black/40 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-green-900/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-green-400 mb-3 text-center">Criar Conta</h1>
            
            {/* Indicador de progresso dos passos */}
            <div className="mb-8">
              {/* Container para círculos e linha de progresso */}
              <div className="flex justify-between items-center w-full relative">
                {/* Linha de progresso */}
                <div className="absolute h-1 bg-gray-300 left-0 right-0 top-1/2 transform -translate-y-1/2 z-0"></div>
                <div 
                  className="absolute h-1 bg-gradient-to-r from-green-500 to-green-600 left-0 top-1/2 transform -translate-y-1/2 transition-all duration-500 z-0"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
                
                {/* Apenas os círculos de progresso */}
                {Array.from({ length: totalSteps }).map((_, index) => {
                  const stepNum = index + 1;
                  const isActive = stepNum === currentStep;
                  const isCompleted = stepNum < currentStep;
                  
                  return (
                    <motion.div 
                      key={`step-${stepNum}`}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium z-10
                        ${isActive 
                          ? 'bg-green-600 text-white ring-4 ring-green-100' 
                          : isCompleted 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }
                      `}
                      initial={{ scale: 1 }}
                      animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
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
              {/* Conteúdo do passo atual */}
              {renderStepContent()}
              
              {/* Botões de navegação entre passos */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition duration-200 flex items-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Voltar
                  </motion.button>
                ) : (
                  <div></div> // Espaçador para manter o layout
                )}
                
                <motion.button
                  type="submit"
                  disabled={isLoading || authLoading}
                  className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white font-medium rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading || authLoading 
                    ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processando...
                      </>
                    )
                    : currentStep < totalSteps 
                      ? (
                        <>
                          Próximo
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      ) 
                      : 'Criar Conta'
                  }
                </motion.button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-green-200">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-green-400 hover:text-green-300 hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 