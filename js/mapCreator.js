const LEVEL_TYPES = {
  NORMAL: 0,
  BOSS: 1,
  RECOVERY: 2,
};

export class MapCreator {
  static #TOTAL_LEVELS = 6;

  static #BOSS_MIN = 1;
  static #BOSS_MAX = 2;

  static #RECOVERY_MIN = 0;
  static #RECOVERY_MAX = 1;

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

  static generate() {
    const bossCount = this.#randInt(this.#BOSS_MIN, this.#BOSS_MAX);
    const recoveryCount = this.#randInt(this.#RECOVERY_MIN, this.#RECOVERY_MAX);
    const normalCount = this.#TOTAL_LEVELS - bossCount - recoveryCount;

    const levels = [
      ...Array(normalCount).fill(LEVEL_TYPES.NORMAL),
      ...Array(bossCount).fill(LEVEL_TYPES.BOSS),
      ...Array(recoveryCount).fill(LEVEL_TYPES.RECOVERY),
    ];

    return this.#shuffle(levels);
  }
}
