import { GameLevel, LEVEL_TYPES } from "./gameLevel.js";
export class GameMap {
  static #TOTAL_LEVELS = 6;

  static #BOSS_MIN = 1;
  static #BOSS_MAX = 2;

  static #RECOVERY_MIN = 0;
  static #RECOVERY_MAX = 1;

  #level = [];
  #currentlevel;
  #currentLevelIndex = 0;

  constructor() {
    this.#generate();
  }

  // ---------- generation ----------

  #generate() {
    const bossCount = GameMap.#randInt(GameMap.#BOSS_MIN, GameMap.#BOSS_MAX);

    const recoveryCount = GameMap.#randInt(
      GameMap.#RECOVERY_MIN,
      GameMap.#RECOVERY_MAX,
    );

    const normalCount = GameMap.#TOTAL_LEVELS - bossCount - recoveryCount;

    const levels = [
      ...Array(normalCount)
        .fill()
        .map(() => new GameLevel(LEVEL_TYPES.NORMAL)),
      ...Array(bossCount)
        .fill()
        .map(() => new GameLevel(LEVEL_TYPES.BOSS)),
      ...Array(recoveryCount)
        .fill()
        .map(() => new GameLevel(LEVEL_TYPES.RECOVERY)),
    ];

    this.#level = GameMap.#shuffle(levels);
    this.#currentlevel = this.#level[0];
  }

  // ---------- helpers ----------

  static #randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static #shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ---------- public ----------

  getAllLevel() {
    return this.#level;
  }

  getLevel(index) {
    return this.#level[index];
  }

  getCurrentLevel() {
    return this.#currentlevel;
  }

  getLevelCount() {
    return this.#level.length;
  }

  getCurrentLevelIndex() {
    return this.#currentLevelIndex;
  }

  nextLevel() {
    if (this.hasNextLevel()) {
      this.#currentLevelIndex++;
      this.#currentlevel = this.#level[this.#currentLevelIndex];
      return this.#currentlevel;
    }
    return null;
  }

  hasNextLevel() {
    return this.#currentLevelIndex < this.#level.length - 1;
  }
}
