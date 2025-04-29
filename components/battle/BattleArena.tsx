import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import BattleHeader from './BattleHeader';
import ParticipantCard from './ParticipantCard';
import SkillSelector from './SkillSelector';
import BattleResultModal from './BattleResultModal';
import BattleGrid from './BattleGrid';
import { FaArrowRight, FaHourglassHalf, FaChevronLeft } from 'react-icons/fa';

interface BattleParticipant {
  id: string;
  participantType: string;
  teamId: string;
  position: number;
  currentHealth: number;
  maxHealth?: number;
  currentPhysicalAttack: number;
  currentSpecialAttack: number;
  currentPhysicalDefense: number;
  currentSpecialDefense: number;
  currentSpeed: number;
  userId?: string;
  enemyId?: string;
  user?: {
    id: string;
    username: string;
    profileImageUrl?: string;
    primaryElementalType: string;
    level: number;
  };
  enemy?: {
    id: string;
    name: string;
    imageUrl: string;
    elementalType: string;
    rarity: string;
    isBoss: boolean;
  };
  statusEffects: any[];
  buffs: any[];
  debuffs: any[];
}

interface BattleProps {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt?: string;
  participants: BattleParticipant[];
}

// Mock de skills para desenvolvimento (apenas como fallback)
const MOCK_SKILLS = [
  { id: 'skill-1', name: 'Rajada de Água', elementalType: 'WATER', power: 25, accuracy: 90, description: 'Lança um jato de água pressurizada', targetType: 'single' as 'single' | 'all' },
  { id: 'skill-2', name: 'Bola de Fogo', elementalType: 'FIRE', power: 30, accuracy: 85, description: 'Lança uma bola de fogo', targetType: 'single' as 'single' | 'all' },
  { id: 'skill-3', name: 'Raio Psíquico', elementalType: 'PSYCHIC', power: 20, accuracy: 95, description: 'Ataca com energia psíquica', targetType: 'single' as 'single' | 'all' },
  { id: 'skill-4', name: 'Terremoto', elementalType: 'EARTH', power: 35, accuracy: 80, description: 'Um forte tremor de terra atinge todos os oponentes', targetType: 'all' as 'single' | 'all' },
];

interface BattleArenaProps {
  battle: BattleProps;
}

interface TurnResult {
  turnNumber: number;
  isFinished: boolean;
  winnerTeam: 'player' | 'enemy' | null;
  playerActions: Record<string, ActionResult>;
  enemyActions: Record<string, ActionResult>;
  participants: BattleParticipant[];
  battle: BattleProps;
  rewards?: {
    experience: number;
    gold: number;
    items: any[];
    unlockedSkills: any[];
  };
}

interface ActionResult {
  damage: number;
  isCritical: boolean;
  accuracy: boolean;
  statusEffects: any[];
  buffs: any[];
  debuffs: any[];
  messages: string[];
}

const BattleArena: React.FC<BattleArenaProps> = ({ battle }) => {
  const { theme } = useHouseTheme();
  const { token, user } = useAuth();
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [turnPhase, setTurnPhase] = useState<'selection' | 'animation' | 'result'>('selection');
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResults, setShowResults] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState<string | undefined>(undefined);
  const [turnResult, setTurnResult] = useState<TurnResult | null>(null);
  const [battleState, setBattleState] = useState<BattleProps>(battle);
  const [battleRewards, setBattleRewards] = useState<{
    experience: number;
    levelUp: boolean;
  } | null>(null);
  
  // Obter as skills do usuário logado
  const userSkills = user?.userSkills?.filter(skill => skill.equipped) || [];
  
  // Transformar as skills do usuário para o formato esperado (ou usar mock se não tiver skills)
  const availableSkills = userSkills.length > 0 
    ? userSkills.map(userSkill => ({
        id: userSkill.skill.id,
        name: userSkill.skill.name,
        elementalType: userSkill.skill.elementalType,
        power: userSkill.skill.power,
        accuracy: userSkill.skill.accuracy,
        description: userSkill.skill.description,
        targetType: 'single' as 'single' | 'all', // Assumindo single como padrão se não tiver essa info
      }))
    : MOCK_SKILLS; // Fallback para o mock caso o usuário não tenha skills
  
  // Verificar todos os tipos de participantes possíveis
  const playerTeam = battleState.participants.filter(p => 
    p.participantType === 'player' || 
    p.participantType === 'user' || 
    p.teamId === 'player'
  );
  const enemyTeam = battleState.participants.filter(p => 
    p.participantType === 'enemy' || 
    p.teamId === 'enemy'
  );
  
  // Definir o participante ativo com base no time do jogador
  useEffect(() => {
    if (playerTeam.length > 0) {
      const playerParticipant = playerTeam[0];
      setActiveParticipant(playerParticipant.id);
    }
  }, [playerTeam]);
  
  // Garantir que um participante ativo seja definido ao iniciar a batalha
  useEffect(() => {
    if (!activeParticipant && battleState.participants.length > 0) {
      // Tenta encontrar um participante do jogador
      const userParticipants = battleState.participants.filter(p => 
        p.participantType === 'player' || 
        p.participantType === 'user' || 
        p.teamId === 'player' ||
        p.userId === user?.id
      );
      
      if (userParticipants.length > 0) {
        setActiveParticipant(userParticipants[0].id);
      }
    }
  }, []); // Executa apenas na montagem do componente
  
  // Atualizar o estado da batalha quando receber uma nova
  useEffect(() => {
    setBattleState(battle);
  }, [battle]);
  
  // Setup timer for skill selection
  useEffect(() => {
    if (turnPhase !== 'selection') return;
    
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      // Auto-submit if time runs out
      handleSubmitTurn();
    }
  }, [timeLeft, turnPhase]);
  
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
    
    // Se a skill for de alvo múltiplo, não precisa selecionar alvo
    const skill = availableSkills.find(s => s.id === skillId);
    if (skill?.targetType === 'all') {
      setSelectedTarget('all');
    } else {
      setSelectedTarget(null);
    }
  };
  
  const handleTargetSelect = (targetId: string) => {
    setSelectedTarget(targetId);
  };
  
  const handleSubmitTurn = async () => {
    if (!selectedSkill) {
      // Se não selecionou skill, escolhe a primeira automaticamente
      setSelectedSkill(availableSkills[0]?.id || null);
      setSelectedTarget(enemyTeam[0]?.id || null);
    }
    
    // Se não temos activeParticipant, mas temos jogadores, use o primeiro
    let actorId = activeParticipant;
    if (!actorId && playerTeam.length > 0) {
      actorId = playerTeam[0].id;
    }
    
    // Verificação adicional para garantir que temos todos os dados necessários
    if (!actorId || !selectedSkill) {
      return;
    }

    // Determinando o alvo correto
    const targetId = selectedTarget === 'all' 
      ? enemyTeam[0]?.id 
      : (selectedTarget || enemyTeam[0]?.id);

    // Verificação adicional para o targetId
    if (!targetId) {
      return;
    }
    
    setTurnPhase('animation');
    
    try {
      // Preparar dados para enviar no formato correto exato que o backend espera
      const actions = [{
        actorId: actorId,
        targetId: targetId,
        skillId: selectedSkill
      }];
      
      // Chamar a API para processar o turno
      const response = await fetch(`http://localhost:3000/api/battles/${battleState.id}/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actions })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao processar turno');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Atualizar dados da batalha
        setTurnResult(data.data);
        setBattleState(data.data.battle);
        
        // Mudar para fase de resultado
        setTurnPhase('result');
        
        // Verificar se a batalha terminou
        if (data.data.isFinished) {
          // Se recebemos recompensas diretamente na resposta do turno
          if (data.data.rewards) {
            setBattleRewards({
              experience: data.data.rewards.experience || 0,
              levelUp: data.data.rewards.levelUp || false
            });
            setShowResults(true);
          } 
          // Caso contrário, buscamos as recompensas separadamente
          else if (data.data.winnerTeam === 'player') {
            fetchBattleRewards();
          } else {
            // Mostrar derrota
            setShowResults(true);
            setBattleRewards({
              experience: 0,
              levelUp: false
            });
          }
        }
      } else {
        throw new Error(data.message || 'Ocorreu um erro ao processar o turno');
      }
    } catch (error) {
      console.error('Erro ao processar turno:', error);
      
      // Simulação para desenvolvimento
      // Em produção, lidar melhor com erros
      setTimeout(() => {
        setTurnPhase('result');
        
        if (battleState.currentTurn >= 3) {
          setShowResults(true);
        } else {
          // Próximo turno simulado
          setBattleState({
            ...battleState,
            currentTurn: battleState.currentTurn + 1
          });
        }
      }, 2000);
    }
  };
  
  const fetchBattleRewards = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/battles/${battleState.id}/rewards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao obter recompensas');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBattleRewards({
          experience: data.data.experience,
          levelUp: data.data.levelUp
        });
        setShowResults(true);
      }
    } catch (error) {
      console.error('Erro ao obter recompensas:', error);
      
      // Simulação para desenvolvimento
      setBattleRewards({
        experience: 150,
        levelUp: false
      });
      setShowResults(true);
    }
  };
  
  const handleNextTurn = () => {
    // Reinicia para o próximo turno
    setTurnPhase('selection');
    setTimeLeft(30);
    setSelectedSkill(null);
    setSelectedTarget(null);
    setTurnResult(null);
  };
  
  if (showResults) {
    return (
      <BattleResultModal 
        result={{ 
          victory: turnResult?.winnerTeam === 'player',
          experienceGained: battleRewards?.experience || 0, 
          levelUp: battleRewards?.levelUp || false 
        }}
        onClose={() => router.push('/battle')}
      />
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push('/battle')}
          className="p-2 rounded-full mr-4 flex items-center justify-center"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <FaChevronLeft color={theme.colors.text} />
        </button>
        
        <h1 
          className="text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          Batalha: Turno {battleState.currentTurn}
        </h1>
        
        {turnPhase === 'selection' && (
          <div 
            className="flex items-center px-3 py-1 rounded-full ml-4"
            style={{ 
              backgroundColor: timeLeft <= 10 
                ? '#F44336' 
                : (timeLeft <= 20 ? '#FF9800' : theme.colors.primary)
            }}
          >
            <span style={{ color: theme.colors.text }}>{timeLeft}s</span>
          </div>
        )}
      </div>
      
      {/* Arena de Batalha com Grid */}
      <BattleGrid
        playerTeam={playerTeam}
        enemyTeam={enemyTeam}
        selectedSkill={selectedSkill}
        selectedTarget={selectedTarget}
        turnPhase={turnPhase}
        onTargetSelect={handleTargetSelect}
        activeParticipant={activeParticipant}
      />
      
      {/* Seleção de Habilidades */}
      {turnPhase === 'selection' && (
        <div className="p-4 rounded-lg"
          style={{ backgroundColor: theme.colors.background }}>
          <h3 className="text-lg font-medium mb-3"
            style={{ color: theme.colors.primary }}>
            Escolha sua ação
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {availableSkills.map(skill => (
              <SkillSelector
                key={skill.id}
                skill={skill}
                isSelected={selectedSkill === skill.id}
                onClick={() => handleSkillSelect(skill.id)}
              />
            ))}
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmitTurn}
              disabled={!selectedSkill || (!selectedTarget && selectedTarget !== 'all')}
              className={`py-2 px-6 rounded-md flex items-center ${
                !selectedSkill || (!selectedTarget && selectedTarget !== 'all') ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text
              }}
            >
              <span className="mr-2">Confirmar</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
      
      {/* Animação de Processamento */}
      {turnPhase === 'animation' && (
        <div className="p-6 rounded-lg text-center"
          style={{ backgroundColor: theme.colors.background }}>
          <FaHourglassHalf 
            className="mx-auto mb-4" 
            size={40} 
            style={{ color: theme.colors.primary }} 
          />
          <p className="text-lg" style={{ color: theme.colors.text }}>
            Processando turno...
          </p>
        </div>
      )}
      
      {/* Resultados do Turno */}
      {turnPhase === 'result' && (
        <div className="p-6 rounded-lg"
          style={{ backgroundColor: theme.colors.background }}>
          <h3 className="text-lg font-medium mb-4"
            style={{ color: theme.colors.primary }}>
            Resultados do Turno {battleState.currentTurn}
          </h3>
          
          {turnResult ? (
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={{ color: theme.colors.secondary }}>
                  Suas ações:
                </h4>
                {Object.entries(turnResult.playerActions).map(([participantId, action], index) => (
                  <div key={index} className="mb-2">
                    {action.messages && action.messages.length > 0 ? (
                      action.messages.map((message, msgIndex) => (
                        <p key={`msg-${msgIndex}`} style={{ color: theme.colors.text }}>
                          {message}
                        </p>
                      ))
                    ) : (
                      <p style={{ color: theme.colors.text }}>
                        {action.accuracy === false ? (
                          <>
                            Você tentou usar <span style={{ color: theme.colors.primary }}>
                              {availableSkills.find(s => s.id === selectedSkill)?.name}
                            </span> mas errou!
                          </>
                        ) : (
                          <>
                            Você usou <span style={{ color: theme.colors.primary }}>
                              {availableSkills.find(s => s.id === selectedSkill)?.name}
                            </span> e causou <span style={{ color: theme.colors.accent }}>
                              {action.damage} de dano
                            </span>!
                            {action.isCritical && <span className="ml-1 text-yellow-500">(Crítico!)</span>}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={{ color: theme.colors.secondary }}>
                  Ações inimigas:
                </h4>
                {Object.entries(turnResult.enemyActions).length > 0 ? (
                  Object.entries(turnResult.enemyActions).map(([participantId, action], index) => (
                    <div key={index} className="mb-2">
                      {action.messages && action.messages.length > 0 ? (
                        action.messages.map((message, msgIndex) => (
                          <p key={`msg-${msgIndex}`} style={{ color: theme.colors.text }}>
                            {message}
                          </p>
                        ))
                      ) : (
                        <p style={{ color: theme.colors.text }}>
                          {action.accuracy === false ? (
                            <>
                              Inimigo errou o ataque!
                            </>
                          ) : (
                            <>
                              Inimigo causou <span style={{ color: theme.colors.accent }}>
                                {action.damage} de dano
                              </span>!
                              {action.isCritical && <span className="ml-1 text-yellow-500">(Crítico!)</span>}
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: theme.colors.text }}>
                    Não houve ações inimigas neste turno.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={{ color: theme.colors.secondary }}>
                  Seu ataque:
                </h4>
                <p style={{ color: theme.colors.text }}>
                  Você usou <span style={{ color: theme.colors.primary }}>
                    {availableSkills.find(s => s.id === selectedSkill)?.name || 'Ataque básico'}
                  </span> e causou <span style={{ color: theme.colors.accent }}>25 de dano</span>!
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2" style={{ color: theme.colors.secondary }}>
                  Ataque inimigo:
                </h4>
                <p style={{ color: theme.colors.text }}>
                  {enemyTeam[0]?.enemy?.name || 'Dragão de Fogo'} usou <span style={{ color: theme.colors.primary }}>Bola de Fogo</span> e causou <span style={{ color: theme.colors.accent }}>20 de dano</span>!
                </p>
              </div>
            </>
          )}
          
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextTurn}
              className="py-2 px-6 rounded-md flex items-center"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text
              }}
            >
              <span className="mr-2">Próximo Turno</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleArena; 