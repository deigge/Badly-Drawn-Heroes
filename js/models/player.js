import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

/**
 * The player-controlled entity. Adds a damage-taken multiplier on top of
 * `Entity`, used to apply the temporary reduction gained from blocking.
 */
class Player extends Entity {
  #damageTakenMultiplier = 1;

  constructor() {
    super(SpriteType.PLAYER, 100, "playerIdle", 20);
  }

  set damageTakenMultiplier(mp) {
    this.#damageTakenMultiplier = mp;
  }

  /**
   * Resets the damage-taken multiplier back to normal (1), e.g. after an
   * enemy's attack following a block has been resolved.
   *
   * @returns {void}
   */
  resetDamageTakenMultiplier() {
    this.#damageTakenMultiplier = 1;
  }

  /**
   * Applies the current damage-taken multiplier before passing damage on
   * to the base `Entity` implementation.
   *
   * @param {number} damage - Raw incoming damage, before reduction.
   * @returns {void}
   */
  takeDamage(damage) {
    const reduced = Math.round(damage * this.#damageTakenMultiplier);
    super.takeDamage(reduced);
  }
}

/** The single, shared player instance, set once `createPlayer()` resolves. */
export let player;

/**
 * Creates and assigns the shared `player` instance. Must be awaited (e.g.
 * during asset preloading) before any code reads `player`.
 *
 * @returns {Promise<Player>} The created player instance.
 */
export async function createPlayer() {
  player = await Player.create();
  return player;
}
