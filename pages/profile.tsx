import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';
import { API_ENDPOINTS } from '../lib/config';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import HeaderSection from '../components/dashboard/HeaderSection';
import UserStats from '../components/dashboard/UserStats';

interface ProfileData {
  id: string;
  username: string;
  level: number;
  experience: number;
  primaryElementalType: string;
  attributes: {
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
    id?: string;
    userId?: string;
  };
  attributePointsToDistribute: number;
  house: {
    id: string;
    name: string;
  };
}

type StatKey = 'health' | 'physicalAttack' | 'specialAttack' | 'physicalDefense' | 'specialDefense' | 'speed';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useHouseTheme();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempAttributes, setTempAttributes] = useState<Record<string, number>>({});
  const [pointsLeft, setPointsLeft] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token não encontrado');
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const { data } = await response.json();
          setProfileData(data);
          
          // Inicializar os atributos temporários com os valores atuais
          if (data.attributes) {
            setTempAttributes({
              health: Number(data.attributes.health),
              physicalAttack: Number(data.attributes.physicalAttack),
              specialAttack: Number(data.attributes.specialAttack),
              physicalDefense: Number(data.attributes.physicalDefense),
              specialDefense: Number(data.attributes.specialDefense),
              speed: Number(data.attributes.speed),
            });
            
            // Inicializar os pontos disponíveis
            setPointsLeft(Number(data.attributePointsToDistribute) || 0);
          }
        } else {
          setError('Não foi possível carregar os dados do perfil');
        }
      } catch (err) {
        setError('Erro ao conectar ao servidor');
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isAuthenticated]);

  const handleIncreaseAttribute = (attribute: string) => {
    if (pointsLeft <= 0) return;
    
    setTempAttributes(prev => ({
      ...prev,
      [attribute]: (prev[attribute] || 0) + 1
    }));
    
    setPointsLeft(prev => prev - 1);
  };
  
  const handleDecreaseAttribute = (attribute: string) => {
    if (!profileData) return;
    
    const originalValue = Number(profileData.attributes[attribute as StatKey]) || 0;
    const currentValue = tempAttributes[attribute] || 0;
    
    // Não permitir reduzir abaixo do valor original
    if (currentValue <= originalValue) return;
    
    setTempAttributes(prev => ({
      ...prev,
      [attribute]: prev[attribute] - 1
    }));
    
    setPointsLeft(prev => prev + 1);
  };
  
  const saveAttributes = async () => {
    if (!profileData) return;
    
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSaveError('Token não encontrado');
        return;
      }
      
      // Calcular apenas os incrementos dos atributos
      const attributeIncrements: Record<string, number> = {};
      
      Object.keys(tempAttributes).forEach(key => {
        const originalValue = Number(profileData.attributes[key as StatKey] || 0);
        const newValue = Number(tempAttributes[key] || 0);
        
        // Apenas incluir atributos que foram aumentados
        if (newValue > originalValue) {
          attributeIncrements[key] = newValue - originalValue;
        }
      });
      
      // Calcular o total de pontos usados
      const pointsUsed = Object.values(attributeIncrements).reduce((sum, value) => sum + value, 0);
      
      // Log para debugging
      console.log('Incrementos de atributos a enviar:', attributeIncrements);
      console.log('Total de pontos usados:', pointsUsed);
      
      const apiUrl = 'http://localhost:3000/api/users/attributes';
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(attributeIncrements)
      });
      
      // Log da resposta para debugging
      console.log('Status da resposta:', response.status);
      
      const data = await response.json();
      console.log('Resposta completa:', data);
      
      if (response.ok && data.success) {
        // Atualizar os dados do perfil com os novos atributos
        setProfileData(prev => {
          if (!prev) return null;
          
          // Atualizar os atributos baseado nos incrementos
          const updatedAttributes = { ...prev.attributes };
          
          Object.entries(attributeIncrements).forEach(([key, increment]) => {
            const attrKey = key as StatKey;
            updatedAttributes[attrKey] = Number(updatedAttributes[attrKey] || 0) + increment;
          });
          
          // Calcular os pontos restantes
          const remainingPoints = Math.max(0, prev.attributePointsToDistribute - pointsUsed);
          
          return {
            ...prev,
            attributes: updatedAttributes,
            attributePointsToDistribute: remainingPoints
          };
        });
        
        // Limpar os atributos temporários
        setTempAttributes({});
        
        // Atualizar os pontos restantes
        setPointsLeft(prev => Math.max(0, prev - pointsUsed));
        
        setSaveSuccess(true);
        
        // Esconder a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setSaveError(data.message || 'Erro ao salvar atributos');
      }
    } catch (err) {
      console.error('Erro detalhado:', err);
      setSaveError('Erro ao conectar ao servidor');
    } finally {
      setIsSaving(false);
    }
  };

  // Verificar se algum atributo foi modificado
  const hasAttributeChanges = () => {
    if (!profileData) return false;
    
    // Se ainda tiver pontos não distribuídos
    if (pointsLeft < Number(profileData.attributePointsToDistribute || 0)) {
      return true;
    }
    
    // Verificar se algum valor é diferente do original
    return Object.keys(tempAttributes).some(key => {
      const originalValue = Number(profileData.attributes[key as StatKey] || 0);
      const newValue = Number(tempAttributes[key] || 0);
      return newValue > 0 && newValue !== originalValue;
    });
  };

  const renderAttributesSection = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-2 py-2">
          <div className="h-2 rounded w-2/3" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-1/2" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-3/4" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
        </div>
      );
    }

    if (error || !profileData) {
      return (
        <div 
          className="text-center p-3 rounded-lg"
          style={{ backgroundColor: `${theme.colors.backgroundDark}50` }}
        >
          <p style={{ color: theme.colors.text }}>{error || 'Dados não disponíveis'}</p>
        </div>
      );
    }

    // Filtrando os atributos para remover id e userId
    const filteredAttributes = {
      health: tempAttributes.health || Number(profileData.attributes.health),
      physicalAttack: tempAttributes.physicalAttack || Number(profileData.attributes.physicalAttack),
      specialAttack: tempAttributes.specialAttack || Number(profileData.attributes.specialAttack),
      physicalDefense: tempAttributes.physicalDefense || Number(profileData.attributes.physicalDefense),
      specialDefense: tempAttributes.specialDefense || Number(profileData.attributes.specialDefense),
      speed: tempAttributes.speed || Number(profileData.attributes.speed)
    };

    // Função para adicionar pontos para teste
    const addTestPoints = () => {
      setPointsLeft(prev => prev + 5);
      setProfileData(prev => prev ? {
        ...prev,
        attributePointsToDistribute: (prev.attributePointsToDistribute || 0) + 5
      } : null);
    };

    return (
      <section className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="flex items-center gap-1" style={{ color: theme.colors.primary }}>
              <span className="text-sm" style={{ color: theme.colors.text }}>Nível {profileData.level}</span>
              <span className="text-xs" style={{ color: `${theme.colors.text}60` }}>
                ({profileData.experience}/100 XP)
              </span>
            </h2>
            
            {/* Barra de progresso de experiência */}
            <div 
              className="h-1.5 w-36 rounded-full mt-1 overflow-hidden"
              style={{ backgroundColor: `${theme.colors.backgroundDark}80` }}
            >
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${(profileData.experience / 100) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.colors.primary}60, ${theme.colors.primary})` 
                }}
              />
            </div>
          </div>
          
          {/* Botão de teste para adicionar pontos */}
          <button
            onClick={addTestPoints}
            className="px-3 py-1 text-xs rounded"
            style={{ 
              backgroundColor: `${theme.colors.backgroundDark}80`,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.primary}30`
            }}
          >
            +5 pontos (Teste)
          </button>
        </div>
        
        {/* Seção de Atributos */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-sm rounded-xl p-4"
          style={{ 
            background: `linear-gradient(160deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
            borderTop: `1px solid ${theme.colors.primary}30`
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: theme.colors.primary }}>
              <span>🛡️</span>
              Atributos
            </h3>
            
            {pointsLeft > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                {pointsLeft} pontos
              </span>
            )}
          </div>
          
          {/* Sistema de distribuição de atributos */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(filteredAttributes).map(([key, value]) => {
              const originalValue = Number(profileData.attributes[key as StatKey] || 0);
              const hasIncreased = Number(value) > originalValue;
              
              return (
                <div key={key} className="flex items-center justify-between border-b border-gray-800 pb-1.5">
                  <div>
                    <div className="text-xs" style={{ color: theme.colors.text }}>
                      {formatAttributeName(key)}
                    </div>
                    <div className="flex items-center">
                      <span className="text-base font-bold" style={{ color: hasIncreased ? theme.colors.primary : theme.colors.text }}>
                        {value}
                      </span>
                      {hasIncreased && (
                        <span className="text-xs ml-1" style={{ color: theme.colors.primary }}>
                          (+{Number(value) - originalValue})
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {pointsLeft > 0 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleDecreaseAttribute(key)}
                        disabled={Number(value) <= originalValue}
                        className={`w-6 h-6 flex items-center justify-center rounded-full ${Number(value) <= originalValue ? 'opacity-30' : 'hover:opacity-80'}`}
                        style={{ backgroundColor: `${theme.colors.backgroundDark}80`, color: theme.colors.text }}
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleIncreaseAttribute(key)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:opacity-80"
                        style={{ backgroundColor: `${theme.colors.primary}80`, color: '#fff' }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Poder de Batalha e Botão de Salvar */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs" style={{ color: `${theme.colors.text}90` }}>
                  Poder
                </div>
                <div className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                  {Object.values(filteredAttributes).reduce((sum, value) => sum + Number(value), 0)}
                </div>
              </div>
              
              <div className="text-center px-2 py-1 rounded-md backdrop-blur-sm" 
                style={{ 
                  backgroundColor: `${theme.colors.backgroundDark}80`,
                  border: `1px solid ${theme.colors.primary}30`
                }}
              >
                <div className="text-xs" style={{ color: `${theme.colors.text}80` }}>
                  Rank
                </div>
                <div className="font-semibold" style={{ color: theme.colors.text }}>
                  {calcRank(Object.values(filteredAttributes).reduce((sum, value) => sum + Number(value), 0))}
                </div>
              </div>
            </div>
            
            {/* Botão de salvar inline */}
            {hasAttributeChanges() && (
              <button
                onClick={saveAttributes}
                disabled={isSaving}
                className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            )}
          </div>
          
          {/* Mensagens de erro/sucesso */}
          {(saveError || saveSuccess) && (
            <div className="mt-2 text-xs text-center" 
                 style={{ color: saveError ? '#f44336' : '#4caf50' }}>
              {saveError || (saveSuccess ? 'Atributos salvos com sucesso!' : '')}
            </div>
          )}
        </motion.div>
      </section>
    );
  };

  return (
    <DashboardLayout theme={theme}>
      <HeaderSection 
        theme={theme}
        user={user}
        houseName={user?.house?.name || 'Sem Casa'}
        hasHouse={!!user?.house}
        houseId={user?.house?.id || ''}
      />
      
      <main className="container mx-auto px-3 py-4">
        {renderAttributesSection()}
      </main>
    </DashboardLayout>
  );
};

// Função para calcular o rank com base no poder total
const calcRank = (totalPower: number): string => {
  if (totalPower < 100) return 'D';
  if (totalPower < 150) return 'C';
  if (totalPower < 200) return 'B';
  if (totalPower < 250) return 'A';
  return 'S';
};

// Função auxiliar para formatar os nomes dos atributos
const formatAttributeName = (attribute: string): string => {
  const nameMap: Record<string, string> = {
    health: 'Vida',
    physicalAttack: 'Ataque Físico',
    specialAttack: 'Ataque Especial',
    physicalDefense: 'Defesa Física',
    specialDefense: 'Defesa Especial',
    speed: 'Velocidade'
  };
  
  return nameMap[attribute] || attribute;
};

export default ProfilePage; 