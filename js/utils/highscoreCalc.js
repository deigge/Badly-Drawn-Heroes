import { LEVEL_TYPES } from "../models/gameLevel.js";

/** Base points awarded per damage tier (drawing accuracy result). */
const TIER_SCORE = {
  0: 0,
  0.25: 1,
  0.5: 3,
  0.75: 6,
  1.0: 10,
};

/** Score multiplier applied to heavy attacks on top of the base tier score. */
const HEAVY_ATTACK_MULTIPLIER = 1.5;

/** Bonus points awarded for completing a level, by level type. */
const LEVEL_COMPLETION_BONUS = {
  [LEVEL_TYPES.NORMAL]: 30,
  [LEVEL_TYPES.BOSS]: 80,
  [LEVEL_TYPES.RECOVERY]: 10,
};

/**
 * Calculates the score awarded for a single attack, based on its accuracy
 * tier and whether it was a light or heavy attack.
 *
 * @param {number} damageTier - Accuracy tier from `scoreAttack` (0, 0.25, 0.5, 0.75, or 1.0).
 * @param {boolean} isLightAttack - Whether the attack was a light attack (heavy attacks get a score bonus).
 * @returns {number} Points earned for this attack.
 */
export function pointsForAttack(damageTier, isLightAttack) {
  const basePoints = TIER_SCORE[damageTier] ?? 0;
  return isLightAttack ? basePoints : basePoints * HEAVY_ATTACK_MULTIPLIER;
}

/**
 * Returns the bonus points awarded for completing a level of the given type.
 *
 * @param {string} levelType - One of `LEVEL_TYPES`.
 * @returns {number} Bonus points for completing that level type.
 */
export function pointsForLevelCompletion(levelType) {
  return LEVEL_COMPLETION_BONUS[levelType] ?? 0;
}
