import { GameLevel, LEVEL_TYPES } from "./gameLevel.js";

/**
 * A full playthrough map: a shuffled sequence of levels (normal, boss,
 * recovery) with a fixed total count and a random mix of boss/recovery levels.
 */
export class GameMap {
  static #TOTAL_LEVELS = 6;

  static #BOSS_MIN = 1;
  static #BOSS_MAX = 2;

  static #RECOVERY_MIN = 0;
  static #RECOVERY_MAX = 1;

  #level = [];
  #currentlevel;
  #currentLevelIndex = 0;

  /**
   * Creates and generates a full map.
   *
   * @returns {Promise<GameMap>} The generated map, ready to play.
   */
  static async create() {
    const map = new this();
    await map.#generate();
    return map;
  }

  /**
   * Determines how many of each level type to create, instantiates them
   * all in parallel, shuffles the order, and sets the first level as current.
   *
   * @returns {Promise<void>}
   */
  async #generate() {
    const bossCount = GameMap.#randInt(GameMap.#BOSS_MIN, GameMap.#BOSS_MAX);
    const recoveryCount = GameMap.#randInt(
      GameMap.#RECOVERY_MIN,
      GameMap.#RECOVERY_MAX,
    );
    const normalCount = GameMap.#TOTAL_LEVELS - bossCount - recoveryCount;

    // Build three arrays of placeholder slots (one per level type) and create
    // a level for each slot in parallel, then flatten them into one list.
    const levels = await Promise.all([
      ...Array(normalCount)
        .fill()
        .map(async () => await GameLevel.create(LEVEL_TYPES.NORMAL)),
      ...Array(bossCount)
        .fill()
        .map(async () => await GameLevel.create(LEVEL_TYPES.BOSS)),
      ...Array(recoveryCount)
        .fill()
        .map(async () => await GameLevel.create(LEVEL_TYPES.RECOVERY)),
    ]);

    this.#level = GameMap.#shuffle(levels);
    this.#currentlevel = this.#level[0];
  }

  /**
   * @param {number} min - Inclusive lower bound.
   * @param {number} max - Inclusive upper bound.
   * @returns {number} A random integer between `min` and `max`.
   */
  static #randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Randomly reorders an array in place using the Fisher–Yates shuffle.
   *
   * @template T
   * @param {T[]} array - Array to shuffle.
   * @returns {T[]} The same array, shuffled.
   */
  static #shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // swap array[i] and array[j]
    }
    return array;
  }

  get allLevel() {
    return this.#level;
  }

  /**
   * @param {number} index - Zero-based level index.
   * @returns {GameLevel} The level at the given index.
   */
  getLevel(index) {
    return this.#level[index];
  }

  get currentLevel() {
    return this.#currentlevel;
  }

  get levelCount() {
    return this.#level.length;
  }

  get currentLevelIndex() {
    return this.#currentLevelIndex;
  }

  /**
   * Advances to and returns the next level, or `null` if the map is complete.
   * Has a side effect: updates `currentLevel`/`currentLevelIndex` when advancing.
   *
   * @returns {GameLevel | null}
   */
  get nextLevel() {
    if (this.hasNextLevel()) {
      this.#currentLevelIndex++;
      this.#currentlevel = this.#level[this.#currentLevelIndex];
      return this.#currentlevel;
    }
    return null;
  }

  /**
   * @returns {boolean} Whether there is a level after the current one.
   */
  hasNextLevel() {
    return this.#currentLevelIndex < this.#level.length - 1;
  }
}
