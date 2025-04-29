import { Battle, BattleParticipant } from '../types/battle';

/**
 * Determina se o usuário venceu uma batalha.
 * Verifica o winnerId e também o HP dos participantes para determinar o resultado.
 */
export const determinarVencedorBatalha = (
  battle: Battle,
  userId: string
): 'vitoria' | 'derrota' | 'indeterminado' => {
  // Caso 1: O ID do vencedor corresponde a um participante do usuário
  if (battle.winnerId) {
    const userParticipant = battle.participants.find(
      (p: BattleParticipant) => p.participantType === 'user' && p.userId === userId
    );
    
    if (userParticipant && userParticipant.id === battle.winnerId) {
      return 'vitoria';
    } else {
      return 'derrota';
    }
  }
  
  // Caso 2: Sem winnerId definido, verificar pelo HP
  if (battle.isFinished) {
    const userParticipant = battle.participants.find(
      (p: BattleParticipant) => p.participantType === 'user' && p.userId === userId
    );
    
    const enemyParticipant = battle.participants.find(
      (p: BattleParticipant) => p.participantType === 'enemy'
    );
    
    if (userParticipant && enemyParticipant) {
      // Usuário tem HP positivo e inimigo tem HP negativo ou zero
      if (userParticipant.currentHealth > 0 && enemyParticipant.currentHealth <= 0) {
        return 'vitoria';
      }
      
      // Usuário tem HP negativo ou zero (derrotado)
      if (userParticipant.currentHealth <= 0) {
        return 'derrota';
      }
    }
  }
  
  // Caso não seja possível determinar com certeza
  return 'indeterminado';
};

/**
 * Obtém estatísticas resumidas das batalhas do usuário
 */
export const obterEstatisticasBatalhas = (battles: Battle[], userId: string) => {
  const total = battles.length;
  let vitorias = 0;
  let derrotas = 0;
  let indeterminadas = 0;
  
  battles.forEach(battle => {
    const resultado = determinarVencedorBatalha(battle, userId);
    if (resultado === 'vitoria') vitorias++;
    else if (resultado === 'derrota') derrotas++;
    else indeterminadas++;
  });
  
  return {
    total,
    vitorias,
    derrotas,
    indeterminadas,
    taxaVitoria: total > 0 ? Math.round((vitorias / total) * 100) : 0
  };
}; 