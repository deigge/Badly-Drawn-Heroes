import { LEVEL_TYPES } from "../models/gameLevel.js";

const TIER_SCORE = {
  0: 0,
  0.25: 1,
  0.5: 3,
  0.75: 6,
  1.0: 10,
};

const HEAVY_ATTACK_MULTIPLIER = 1.5;

const LEVEL_COMPLETION_BONUS = {
  [LEVEL_TYPES.NORMAL]: 30,
  [LEVEL_TYPES.BOSS]: 80,
  [LEVEL_TYPES.RECOVERY]: 10,
};

export function pointsForAttack(damageTier, isLightAttack) {
  const basePoints = TIER_SCORE[damageTier] ?? 0;
  return isLightAttack ? basePoints : basePoints * HEAVY_ATTACK_MULTIPLIER;
}

export function pointsForLevelCompletion(levelType) {
  return LEVEL_COMPLETION_BONUS[levelType] ?? 0;
}
