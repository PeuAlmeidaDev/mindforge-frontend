import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import useHouseTheme from '../hooks/useHouseTheme';
import { API_ENDPOINTS, API_URL } from '../lib/config';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import HeaderSection from '../components/dashboard/HeaderSection';
import UserStats from '../components/dashboard/UserStats';
import ElementalTypeIcon from '../components/ElementalTypeIcon';

interface Skill {
  id: string;
  name: string;
  description: string;
  elementalType: string;
  attackType: string;
  baseDamage: number;
  accuracy: number;
  isAoe: boolean;
  targetType: string;
  buffType: string | null;
  debuffType: string | null;
  statusEffect: string | null;
  statusEffectChance: number | null;
  statusEffectDuration: number | null;
  buffValue: number | null;
  debuffValue: number | null;
}

interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  equipped: boolean;
  skill: Skill;
}

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
  userSkills: UserSkill[];
}

type StatKey = 'health' | 'physicalAttack' | 'specialAttack' | 'physicalDefense' | 'specialDefense' | 'speed';

// Interfaces para o calendário de contribuições
interface CompletedGoal {
  id: string;
  date: string;
  name: string;
}

interface CalendarDayData {
  date: Date;
  count: number;
  goals: CompletedGoal[];
}

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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSkillsSaving, setIsSkillsSaving] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsSuccess, setSkillsSuccess] = useState(false);
  const [contributionCalendarIsGenerating, setContributionCalendarIsGenerating] = useState(false);

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

          // Inicializar as skills selecionadas
          if (data.userSkills) {
            const equippedSkills = data.userSkills
              .filter((userSkill: UserSkill) => userSkill.equipped)
              .map((userSkill: UserSkill) => userSkill.skillId);
            setSelectedSkills(equippedSkills);
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

  // Função para lidar com a seleção/deseleção de skills
  const handleSkillSelection = (skillId: string) => {
    setSelectedSkills(prev => {
      // Se já estiver selecionada, remova-a
      if (prev.includes(skillId)) {
        return prev.filter(id => id !== skillId);
      }
      
      // Se tentar selecionar mais de 4 skills, impedir
      if (prev.length >= 4) {
        return prev;
      }
      
      // Adicionar a skill
      return [...prev, skillId];
    });
  };

  // Função para salvar as skills equipadas
  const saveEquippedSkills = async () => {
    if (!profileData) return;
    
    setIsSkillsSaving(true);
    setSkillsError(null);
    setSkillsSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSkillsError('Token não encontrado');
        return;
      }

      console.log('Enviando skills para equipar:', selectedSkills);
      
      const response = await fetch(`${API_URL}/users/skills`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ equippedSkills: selectedSkills })
      });
      
      // Log da resposta para debugging
      console.log('Status da resposta skills:', response.status);
      
      const data = await response.json();
      console.log('Resposta completa de skills:', data);
      
      if (response.ok && data.success) {
        // Atualizar os dados do perfil com as novas skills equipadas
        setProfileData(prev => {
          if (!prev) return null;
          
          // Atualizar o estado de equipped das skills
          const updatedUserSkills = prev.userSkills.map(userSkill => ({
            ...userSkill,
            equipped: selectedSkills.includes(userSkill.skillId)
          }));
          
          return {
            ...prev,
            userSkills: updatedUserSkills
          };
        });
        
        setSkillsSuccess(true);
        
        // Esconder a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSkillsSuccess(false);
        }, 3000);
      } else {
        setSkillsError(data.message || 'Erro ao salvar habilidades');
      }
    } catch (err) {
      console.error('Erro ao salvar habilidades:', err);
      setSkillsError('Erro ao conectar ao servidor');
    } finally {
      setIsSkillsSaving(false);
    }
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
                 style={{ 
                   color: saveError 
                     ? '#f44336' // Cor de erro padrão
                     : '#4caf50'  // Cor de sucesso padrão
                 }}>
              {saveError || (saveSuccess ? 'Atributos salvos com sucesso!' : '')}
            </div>
          )}
        </motion.div>
      </section>
    );
  };

  // Função para renderizar a seção de Skills
  const renderSkillsSection = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-2 py-2 mt-6">
          <div className="h-2 rounded w-2/3" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-1/2" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-3/4" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
        </div>
      );
    }

    if (error || !profileData) {
      return null;
    }

    const { userSkills } = profileData;

    return (
      <section className="max-w-3xl mx-auto mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="backdrop-blur-sm rounded-xl p-4"
          style={{ 
            background: `linear-gradient(160deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
            borderTop: `1px solid ${theme.colors.primary}30`
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: theme.colors.primary }}>
              Habilidades
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.colors.primary}20`, color: theme.colors.primary }}>
                {selectedSkills.length}/4 equipadas
              </span>
            </h3>
          </div>

          {userSkills.length === 0 ? (
            <div className="text-center p-4">
              <p style={{ color: theme.colors.text }}>Você ainda não desbloqueou nenhuma habilidade.</p>
              <p className="text-sm mt-2" style={{ color: `${theme.colors.text}80` }}>Complete metas diárias para ter chance de desbloquear habilidades!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3">
                {userSkills.map((userSkill) => {
                  const { skill, skillId } = userSkill;
                  const isSelected = selectedSkills.includes(skillId);
                  
                  // Obter cor para o tipo elemental de acordo com o tema
                  const elementColor = getElementalTypeThemeColor(skill.elementalType, theme);
                  
                  return (
                    <div 
                      key={userSkill.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2' : 'hover:brightness-110'}`}
                      style={{ 
                        backgroundColor: `${theme.colors.backgroundDark}80`,
                        borderLeft: `4px solid ${elementColor}`,
                        boxShadow: isSelected ? `0 0 8px ${elementColor}60` : 'none',
                        opacity: selectedSkills.length >= 4 && !isSelected ? 0.6 : 1,
                        borderColor: elementColor,
                        ...(isSelected && { ringColor: theme.colors.primary })
                      }}
                      onClick={() => handleSkillSelection(skillId)}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${elementColor}30`, color: elementColor }}
                          >
                            {getElementIcon(skill.elementalType)}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm" style={{ color: theme.colors.text }}>
                              {skill.name}
                            </h4>
                            <span className="text-xs" style={{ color: `${theme.colors.text}80` }}>
                              {getAttackTypeLabel(skill.attackType)} • {getElementLabel(skill.elementalType)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold" style={{ color: theme.colors.primary }}>
                            {skill.baseDamage} DMG
                          </span>
                          <span className="text-xs" style={{ color: `${theme.colors.text}60` }}>
                            {skill.accuracy}% ACC
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs" style={{ color: `${theme.colors.text}90` }}>
                        {skill.description}
                      </div>
                      
                      {(skill.statusEffect || skill.buffType || skill.debuffType) && (
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {skill.statusEffect && (
                            <span className="text-xs px-2 py-0.5 rounded-full" 
                              style={{ 
                                backgroundColor: getStatusEffectThemeColor(skill.statusEffect, theme), 
                                color: '#fff' 
                              }}>
                              {getStatusEffectLabel(skill.statusEffect)}
                            </span>
                          )}
                          {skill.buffType && (
                            <span className="text-xs px-2 py-0.5 rounded-full" 
                              style={{ 
                                backgroundColor: `${theme && theme.colors ? theme.colors.primary : '#4caf50'}30`, 
                                color: theme && theme.colors ? theme.colors.primary : '#4caf50' 
                              }}>
                              Buff: {skill.buffType}
                            </span>
                          )}
                          {skill.debuffType && (
                            <span className="text-xs px-2 py-0.5 rounded-full" 
                              style={{ 
                                backgroundColor: `${theme && theme.colors ? (theme.colors.tertiary || theme.colors.primary) : '#f44336'}30`, 
                                color: theme && theme.colors ? (theme.colors.tertiary || theme.colors.primary) : '#f44336' 
                              }}>
                              Debuff: {skill.debuffType}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {skill.isAoe && (
                        <div className="mt-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full" 
                            style={{ 
                              backgroundColor: `${theme && theme.colors ? theme.colors.primary : '#4caf50'}20`, 
                              color: theme && theme.colors ? theme.colors.primary : '#4caf50' 
                            }}>
                            AOE
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {selectedSkills.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={saveEquippedSkills}
                    disabled={isSkillsSaving}
                    className="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: '#fff',
                      opacity: isSkillsSaving ? 0.7 : 1
                    }}
                  >
                    {isSkillsSaving ? 'Salvando...' : 'Equipar Habilidades'}
                  </button>
                </div>
              )}
              
              {/* Mensagens de erro/sucesso para skills */}
              {(skillsError || skillsSuccess) && (
                <div className="mt-2 text-xs text-center" 
                     style={{ 
                       color: skillsError 
                         ? '#f44336' // Cor de erro padrão
                         : '#4caf50'  // Cor de sucesso padrão
                     }}>
                  {skillsError || (skillsSuccess ? 'Habilidades equipadas com sucesso!' : '')}
                </div>
              )}
            </>
          )}
        </motion.div>
      </section>
    );
  };

  // Função para renderizar o calendário de contribuições
  const renderContributionCalendar = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse space-y-2 py-2 mt-6">
          <div className="h-2 rounded w-2/3" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-1/2" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
          <div className="h-2 rounded w-3/4" style={{ backgroundColor: `${theme.colors.primary}30` }}></div>
        </div>
      );
    }

    return (
      <section className="max-w-3xl mx-auto mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="backdrop-blur-sm rounded-xl p-4"
          style={{ 
            background: `linear-gradient(160deg, ${theme.colors.backgroundDark} 0%, ${theme.colors.background} 100%)`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
            borderTop: `1px solid ${theme.colors.primary}30`
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: theme.colors.primary }}>
              Calendário de Contribuições
            </h3>
            
            <button
              onClick={(e) => {
                // Adiciona um atributo "disabled" temporário para evitar cliques múltiplos
                (e.target as HTMLButtonElement).disabled = true;
                
                // Adicionar lógica para gerar novas metas
                const calendar = document.getElementById('contribution-calendar');
                if (calendar) {
                  calendar.dispatchEvent(new CustomEvent('generate-goals'));
                }
                
                // Remove o "disabled" depois de um pequeno delay
                setTimeout(() => {
                  (e.target as HTMLButtonElement).disabled = false;
                }, 500);
              }}
              className="px-3 py-1 text-xs rounded transition-all disabled:opacity-70 flex items-center gap-1"
              style={{ 
                backgroundColor: `${theme.colors.backgroundDark}80`,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.primary}30`
              }}
            >
              {contributionCalendarIsGenerating ? (
                <>
                  <div className="w-3 h-3 border-t-2 border-b-2 rounded-full animate-spin mr-1" 
                       style={{ borderColor: theme.colors.primary }}></div>
                  Gerando...
                </>
              ) : (
                <>Gerar Metas de Hoje</>
              )}
            </button>
          </div>
          
          <ContributionCalendar 
            theme={theme} 
            onGeneratingChange={(isGenerating) => setContributionCalendarIsGenerating(isGenerating)} 
          />
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
        {renderSkillsSection()}
        {renderContributionCalendar()}
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

// Função para obter cores baseadas no tipo elemental usando o tema
const getElementalTypeThemeColor = (elementType: string, theme: any): string => {
  // Primeiro verifique se o tema tem as cores elementais específicas
  if (theme?.elementColors?.[elementType.toLowerCase()]) {
    return theme.elementColors[elementType.toLowerCase()];
  }
  
  // Cada casa tem seu próprio conjunto de cores principais (primary, secondary, tertiary, quaternary)
  // Vamos mapear tipos elementais para usar essas cores do tema atual da casa
  const themeElementMapping: Record<string, string> = {
    fire: 'primary',
    water: 'secondary',
    earth: 'tertiary',
    air: 'quaternary',
    light: 'primary',
    dark: 'quaternary',
    nature: 'tertiary',
    electric: 'primary',
    ice: 'secondary',
    psychic: 'primary',
    ghost: 'quaternary',
    steel: 'secondary',
    poison: 'tertiary',
    flying: 'secondary',
    rock: 'tertiary'
  };
  
  // Use o mapeamento para pegar a cor correta do tema atual
  const themeColorKey = themeElementMapping[elementType.toLowerCase()];
  
  // Verifique se temos a cor no tema e se está definida
  if (themeColorKey && theme?.colors?.[themeColorKey]) {
    return theme.colors[themeColorKey];
  }
  
  // Verificação adicional - se o tema tem uma cor primária, use como fallback
  if (theme?.colors?.primary) {
    return theme.colors.primary;
  }
  
  // Cores padrão caso o mapeamento falhe
  const defaultColors: Record<string, string> = {
    fire: '#ff5722',
    water: '#03a9f4',
    earth: '#8d6e63',
    air: '#b3e5fc',
    light: '#ffeb3b',
    dark: '#673ab7',
    nature: '#4caf50',
    electric: '#ffc107',
    ice: '#00bcd4',
    psychic: '#e91e63',
    ghost: '#9c27b0',
    steel: '#78909c',
    poison: '#9c27b0',
    flying: '#03a9f4',
    rock: '#795548'
  };
  
  return defaultColors[elementType.toLowerCase()] || '#607d8b';
};

// Função para obter ícones baseados no tipo elemental
const getElementIcon = (elementType: string): React.ReactNode => {
  return <ElementalTypeIcon type={elementType.toLowerCase()} size={24} />;
};

// Função para obter labels para os tipos elementais
const getElementLabel = (elementType: string): string => {
  const labels: Record<string, string> = {
    fire: 'Fogo',
    water: 'Água',
    earth: 'Terra',
    air: 'Ar',
    light: 'Luz',
    dark: 'Trevas',
    nature: 'Natureza',
    electric: 'Elétrico',
    ice: 'Gelo',
    psychic: 'Psíquico',
    ghost: 'Fantasma',
    steel: 'Aço',
    poison: 'Veneno',
    flying: 'Voador',
    rock: 'Rocha'
  };
  
  return labels[elementType.toLowerCase()] || elementType;
};

// Função para obter labels para os tipos de ataque
const getAttackTypeLabel = (attackType: string): string => {
  const labels: Record<string, string> = {
    physical: 'Físico',
    magical: 'Mágico'
  };
  
  return labels[attackType.toLowerCase()] || attackType;
};

// Função para obter cores para os efeitos de status baseado no tema
const getStatusEffectThemeColor = (statusEffect: string, theme: any): string => {
  // Verificar se o tema tem cores específicas para status
  if (theme?.statusColors?.[statusEffect.toLowerCase()]) {
    return theme.statusColors[statusEffect.toLowerCase()];
  }
  
  // Mapear efeitos de status para cores do tema atual da casa
  const statusThemeMapping: Record<string, string> = {
    burn: 'primary',
    poison: 'tertiary',
    stun: 'quaternary',
    freeze: 'secondary',
    blind: 'quaternary',
    bleed: 'primary',
    confuse: 'tertiary'
  };
  
  // Use o mapeamento para pegar a cor correta do tema atual
  const themeColorKey = statusThemeMapping[statusEffect.toLowerCase()];
  
  // Verifique se temos a cor no tema e se está definida
  if (themeColorKey && theme?.colors?.[themeColorKey]) {
    return theme.colors[themeColorKey];
  }
  
  // Verificação adicional - se o tema tem uma cor primária, use como fallback
  if (theme?.colors?.primary) {
    return theme.colors.primary;
  }
  
  // Cores padrão para os diferentes efeitos de status
  const defaultColors: Record<string, string> = {
    burn: '#ff5722',
    poison: '#9c27b0',
    stun: '#ffc107',
    freeze: '#00bcd4',
    blind: '#607d8b',
    bleed: '#f44336',
    confuse: '#e91e63'
  };
  
  return defaultColors[statusEffect.toLowerCase()] || '#607d8b';
};

// Função para obter labels para os efeitos de status
const getStatusEffectLabel = (statusEffect: string): string => {
  const labels: Record<string, string> = {
    burn: 'Queimadura',
    poison: 'Veneno',
    stun: 'Atordoamento',
    freeze: 'Congelamento',
    blind: 'Cegueira',
    bleed: 'Sangramento',
    confuse: 'Confusão'
  };
  
  return labels[statusEffect.toLowerCase()] || statusEffect;
};

// Componente do Calendário de Contribuições
const ContributionCalendar: React.FC<{ 
  theme: any; 
  onGeneratingChange: (isGenerating: boolean) => void 
}> = ({ theme, onGeneratingChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [contributionData, setContributionData] = useState<CalendarDayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Função para buscar metas diárias
  const fetchCompletedGoals = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Obter o token de autenticação
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado');
        setIsLoading(false);
        return;
      }
      
      // Obter as metas diárias através da API
      const response = await fetch(`${API_URL}/goals/daily`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar metas diárias');
      }
      
      const { data } = await response.json();
      
      if (!data || !Array.isArray(data)) {
        // Fallback para dados simulados se não houver dados reais
        const simulatedData = generateSimulatedData(currentMonth);
        setContributionData(simulatedData);
        return;
      }
      
      // Processar os dados reais da API
      // Filtramos apenas para o mês atual
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Transformar as metas da API em dados para o calendário
      const calendarData: Record<string, CalendarDayData> = {};
      
      // Inicializar todos os dias do mês atual
      for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
        const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        
        calendarData[dateStr] = {
          date,
          count: 0,
          goals: []
        };
      }
      
      // Preencher com as metas concluídas
      data.forEach((userGoal: any) => {
        if (userGoal.completed) {
          const date = new Date(userGoal.dateAssigned);
          const dateStr = date.toISOString().split('T')[0];
          
          // Verificar se a data está no mês atual
          if (date >= firstDayOfMonth && date <= lastDayOfMonth && calendarData[dateStr]) {
            calendarData[dateStr].count += 1;
            
            calendarData[dateStr].goals.push({
              id: userGoal.id,
              date: userGoal.dateAssigned,
              name: userGoal.goal?.name || 'Meta concluída'
            });
          }
        }
      });
      
      // Converter o objeto em array para uso no componente
      const processedData = Object.values(calendarData);
      setContributionData(processedData);
      
    } catch (err) {
      console.error('Erro ao buscar metas concluídas:', err);
      setError('Não foi possível carregar os dados de metas');
      
      // Usar dados simulados como fallback em caso de erro
      const simulatedData = generateSimulatedData(currentMonth);
      setContributionData(simulatedData);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch das metas concluídas ao carregar o componente
  useEffect(() => {
    fetchCompletedGoals();
  }, [currentMonth]);

  // Adicionar event listener para o botão de gerar metas
  useEffect(() => {
    const handleGenerateGoals = async () => {
      await generateDailyGoals();
    };
    
    const calendarElement = document.getElementById('contribution-calendar');
    calendarElement?.addEventListener('generate-goals', handleGenerateGoals);
    
    return () => {
      calendarElement?.removeEventListener('generate-goals', handleGenerateGoals);
    };
  }, []); // Este efeito só roda uma vez na montagem
  
  // Efeito para notificar o componente pai sobre mudanças no estado isGenerating
  useEffect(() => {
    onGeneratingChange(isGenerating);
  }, [isGenerating, onGeneratingChange]);

  // Função para gerar metas diárias através da API
  const generateDailyGoals = async () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado');
        return;
      }
      
      const response = await fetch(`${API_URL}/goals/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setGenerationSuccess(true);
        // Atualizar o calendário após gerar novas metas
        await fetchCompletedGoals();
        
        // Limpar a mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setGenerationSuccess(false);
        }, 3000);
      } else {
        setError(data.message || 'Erro ao gerar metas diárias');
      }
    } catch (error) {
      console.error('Erro ao gerar metas diárias:', error);
      setError('Erro ao gerar metas diárias');
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para simular dados para o calendário
  const generateSimulatedData = (month: Date): CalendarDayData[] => {
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const data: CalendarDayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      
      // Gerar um número aleatório de metas concluídas (0-4)
      const randomCount = Math.floor(Math.random() * 5);
      
      const goals: CompletedGoal[] = [];
      for (let i = 0; i < randomCount; i++) {
        goals.push({
          id: `goal-${day}-${i}`,
          date: date.toISOString(),
          name: `Meta ${i + 1} do dia ${day}`
        });
      }
      
      data.push({
        date,
        count: randomCount,
        goals
      });
    }

    return data;
  };

  // Função para obter dias da semana localizados
  const getDaysOfWeek = (): string[] => {
    return ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  };

  // Função para navegar para o mês anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Função para navegar para o próximo mês
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Função para formatar o nome do mês e ano
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  // Função para obter a cor do quadrado com base no número de metas
  const getContributionColor = (count: number): string => {
    if (count === 0) return `${theme.colors.backgroundDark}40`;
    
    // Usar a cor primária do tema com diferentes opacidades e saturações
    const baseColor = theme.colors.primary;
    
    // Função para converter hex para rgba 
    const hexToRgba = (hex: string, opacity: number): string => {
      // Remover o hash se existir
      hex = hex.replace('#', '');
      
      // Expandir cores abreviadas (por exemplo, #03F para #0033FF)
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      
      // Converter para RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    
    // Aplicar diferentes opacidades com base no número de metas
    if (count === 1) return hexToRgba(baseColor, 0.3);
    if (count === 2) return hexToRgba(baseColor, 0.5);
    if (count === 3) return hexToRgba(baseColor, 0.7);
    return baseColor; // 4 ou mais
  };

  // Renderizar calendário
  return (
    <div className="contribution-calendar" id="contribution-calendar">
      {/* Adicionar exibição de erros ou mensagens de sucesso */}
      {(error || generationSuccess) && (
        <div 
          className="mb-4 px-3 py-2 text-xs text-center rounded transition-all"
          style={{ 
            backgroundColor: error 
              ? `rgba(244, 67, 54, 0.1)` 
              : `rgba(76, 175, 80, 0.1)`,
            color: error 
              ? '#f44336' 
              : '#4caf50'
          }}
        >
          {error || (generationSuccess ? 'Metas diárias geradas com sucesso!' : '')}
        </div>
      )}
      
      {/* Cabeçalho do calendário com navegação */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full hover:bg-gray-800"
          style={{ color: theme.colors.text }}
          disabled={isGenerating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <h4 className="text-sm font-medium capitalize" style={{ color: theme.colors.text }}>
            {formatMonthYear(currentMonth)}
          </h4>
          
          {isGenerating && (
            <div className="ml-2 w-4 h-4 border-t-2 border-b-2 rounded-full animate-spin" 
                 style={{ borderColor: theme.colors.primary }}></div>
          )}
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-gray-800"
          style={{ color: theme.colors.text }}
          disabled={isGenerating}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin" 
               style={{ borderColor: theme.colors.primary }}></div>
        </div>
      ) : (
        <>
          {/* Grid do calendário */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {getDaysOfWeek().map((day, index) => (
              <div key={`header-${index}`} className="text-center text-[10px] font-medium" style={{ color: `${theme.colors.text}90` }}>
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1.5">
            {/* Células para preencher até o primeiro dia do mês */}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7 }).map((_, index) => (
              <div key={`empty-start-${index}`} className="aspect-square"></div>
            ))}
            
            {/* Dias do mês */}
            {contributionData.map((day, index) => (
              <div 
                key={`day-${index}`} 
                className="aspect-square rounded-sm relative cursor-pointer transition-all hover:scale-110 flex items-center justify-center"
                style={{ 
                  backgroundColor: getContributionColor(day.count),
                  transform: selectedDay?.date.getDate() === day.date.getDate() ? 'scale(1.1)' : 'scale(1)',
                  border: selectedDay?.date.getDate() === day.date.getDate() ? `1px solid ${theme.colors.primary}` : 'none'
                }}
                onClick={() => setSelectedDay(selectedDay?.date.getDate() === day.date.getDate() ? null : day)}
                title={`${day.date.getDate()} - ${day.count} meta${day.count !== 1 ? 's' : ''} concluída${day.count !== 1 ? 's' : ''}`}
              >
                <span className="text-[9px] font-semibold opacity-80" 
                      style={{ color: day.count > 2 ? '#fff' : theme.colors.text }}>
                  {day.date.getDate()}
                </span>
              </div>
            ))}
            
            {/* Células para preencher após o último dia do mês */}
            {Array.from({ length: (7 - (new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay() || 7)) % 7 }).map((_, index) => (
              <div key={`empty-end-${index}`} className="aspect-square"></div>
            ))}
          </div>
          
          {/* Legenda */}
          <div className="flex justify-end items-center mt-4 text-[10px]" style={{ color: `${theme.colors.text}90` }}>
            <span className="mr-1">Menos</span>
            {[0, 1, 2, 3, 4].map((count) => (
              <div 
                key={`legend-${count}`} 
                className="w-3 h-3 rounded-sm mx-0.5"
                style={{ backgroundColor: getContributionColor(count) }}
              ></div>
            ))}
            <span className="ml-1">Mais</span>
          </div>
          
          {/* Detalhes do dia selecionado */}
          {selectedDay && (
            <div className="mt-4 px-3 py-2.5 rounded-lg" style={{ backgroundColor: `${theme.colors.backgroundDark}60` }}>
              <h5 className="font-medium text-sm mb-1" style={{ color: theme.colors.primary }}>
                {selectedDay.date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
              </h5>
              
              {selectedDay.count === 0 ? (
                <p className="text-xs" style={{ color: `${theme.colors.text}80` }}>
                  Nenhuma meta concluída neste dia.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {selectedDay.goals.map((goal) => (
                    <div key={goal.id} className="text-xs flex items-start">
                      <span className="mr-1.5 text-lg leading-none" style={{ color: theme.colors.primary }}>•</span>
                      <span style={{ color: theme.colors.text }}>{goal.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage; 