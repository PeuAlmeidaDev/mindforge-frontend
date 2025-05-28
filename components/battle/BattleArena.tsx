import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import useHouseTheme from '../../hooks/useHouseTheme';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import { motion } from 'framer-motion';
import BattleHeader from './BattleHeader';
import ParticipantCard from './ParticipantCard';
import SkillSelector from './SkillSelector';
import BattleResultModal from './BattleResultModal';
import BattleGrid from './BattleGrid';
import { FaArrowRight, FaHourglassHalf, FaChevronLeft } from 'react-icons/fa';
import { BattleParticipant, BattleData } from '../../types/battleTypes';
import { API_ENDPOINTS } from '../../lib/config';

interface BattleProps {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt?: string;
  participants: BattleParticipant[];
}

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
  const { token, user, refreshUserData } = useAuth();
  const { refreshUserData: userRefresh, updateAfterBattle } = useUser();
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
  
  // Transformar as skills do usuário para o formato esperado
  const availableSkills = userSkills.map(userSkill => ({
    id: userSkill.skill.id,
    name: userSkill.skill.name,
    elementalType: userSkill.skill.elementalType,
    power: userSkill.skill.power,
    accuracy: userSkill.skill.accuracy,
    description: userSkill.skill.description,
    targetType: 'single' as 'single' | 'all', // Assume single como padrão
  }));
  
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
    if (availableSkills.length === 0) {
      alert('Você não possui nenhuma habilidade equipada para batalhar!');
      return;
    }

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
      const response = await fetch(`${API_ENDPOINTS.BATTLES.DETAIL(battleState.id)}/turn`, {
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
      
      // Substituindo a simulação por um alerta e retorno à fase de seleção
      alert('Houve um erro ao processar o turno. Por favor, tente novamente.');
      setTurnPhase('selection');
    }
  };
  
  const fetchBattleRewards = async () => {
    if (!turnResult || !turnResult.isFinished || !token) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.BATTLES.REWARDS(battle.id), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao obter recompensas da batalha');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBattleRewards({
          experience: data.data.experience,
          levelUp: data.data.levelUp
        });
        return data.data; // Retornando os dados para uso em outras funções
      } else {
        throw new Error(data.message || 'Falha ao obter recompensas');
      }
    } catch (error) {
      console.error('Erro ao obter recompensas:', error);
      return null;
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
  
  // Função para finalizar a batalha
  const finalizeBattle = useCallback(async () => {
    if (!turnResult || !turnResult.isFinished) return;
    
    try {
      // Buscar recompensas da batalha
      await fetchBattleRewards();
      
      // NÃO atualiza dados nesse momento, apenas exibe o modal
      // para evitar atualizações constantes
      console.log('Finalizando batalha - os dados serão atualizados quando o modal for fechado');
      
      // Exibir modal de resultados
      setShowResults(true);
    } catch (error) {
      console.error('Erro ao finalizar batalha:', error);
      alert('Ocorreu um erro ao finalizar a batalha');
      router.push('/battle');
    }
  }, [battle.id, fetchBattleRewards, turnResult]);

  // Efeito para verificar se a batalha foi finalizada
  useEffect(() => {
    if (turnResult && turnResult.isFinished) {
      finalizeBattle();
    }
  }, [turnResult, finalizeBattle]);
  
  if (showResults) {
    return (
      <BattleResultModal 
        result={{ 
          victory: turnResult?.winnerTeam === 'player',
          experienceGained: battleRewards?.experience || 0, 
          levelUp: battleRewards?.levelUp || false,
          battleId: battle.id
        }}
        onClose={() => {
          // A atualização de dados está acontecendo dentro do BattleResultModal
          // quando o botão é clicado, não aqui
          router.push('/battle');
        }}
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
          
          {availableSkills.length > 0 ? (
            <>
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
            </>
          ) : (
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: theme.colors.background }}>
              <p style={{ color: theme.colors.text }}>
                Você não possui nenhuma habilidade equipada para batalhar!
              </p>
              <button 
                onClick={() => router.push('/profile/skills')}
                className="mt-4 py-2 px-4 rounded-md"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.text }}
              >
                Equipar habilidades
              </button>
            </div>
          )}
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
                  Resultados do turno:
                </h4>
                <p style={{ color: theme.colors.text }}>
                  Não foi possível carregar os detalhes das ações deste turno.
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