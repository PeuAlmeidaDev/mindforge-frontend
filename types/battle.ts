export interface User {
  id: string;
  username: string;
  profileImageUrl: string | null;
  primaryElementalType: string;
  level: number;
}

export interface Enemy {
  id: string;
  name: string;
  imageUrl: string;
  elementalType: string;
  rarity: string;
  isBoss: boolean;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: string;
}

export interface Buff {
  id: string;
  name: string;
  description: string;
  duration: number;
  statAffected: string;
  value: number;
}

export interface Debuff {
  id: string;
  name: string;
  description: string;
  duration: number;
  statAffected: string;
  value: number;
}

export interface BattleParticipant {
  id: string;
  battleId: string;
  participantType: 'user' | 'enemy';
  userId: string | null;
  enemyId: string | null;
  teamId: string;
  position: number;
  currentHealth: number;
  currentPhysicalAttack: number;
  currentSpecialAttack: number;
  currentPhysicalDefense: number;
  currentSpecialDefense: number;
  currentSpeed: number;
  user: User | null;
  enemy: Enemy | null;
  statusEffects: StatusEffect[];
  buffs: Buff[];
  debuffs: Debuff[];
}

export interface Battle {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt: string | null;
  metadata: string;
  participants: BattleParticipant[];
} 