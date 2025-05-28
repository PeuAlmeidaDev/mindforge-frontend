export interface BattleParticipant {
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
    secondaryElementalType?: string | null;
    level: number;
    attributes?: {
      health: number;
      physicalAttack: number;
      specialAttack: number;
      physicalDefense: number;
      specialDefense: number;
      speed: number;
    };
  };
  enemy?: {
    id: string;
    name: string;
    imageUrl: string;
    elementalType: string;
    rarity: string;
    isBoss: boolean;
    health: number;
    physicalAttack: number;
    specialAttack: number;
    physicalDefense: number;
    specialDefense: number;
    speed: number;
  };
  statusEffects: any[];
  buffs: any[];
  debuffs: any[];
}

export interface BattleData {
  id: string;
  currentTurn: number;
  isFinished: boolean;
  winnerId: string | null;
  startedAt: string;
  endedAt?: string;
  participants: BattleParticipant[];
} 