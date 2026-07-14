import { MUSIC } from "../utils/music.js";
import { BossEnemy } from "./bossEnemy.js";
import { NormalEnemy } from "./normalEnemy.js";

/** Valid level types a `GameLevel` can be created with. */
export const LEVEL_TYPES = {
  NORMAL: "normal",
  BOSS: "boss",
  RECOVERY: "recovery",
};

/**
 * A single level within a `GameMap`: knows its type, background music,
 * background image, and the enemies to fight (if any).
 */
export class GameLevel {
  #type;
  #enemies;
  #musicType;

  /**
   * @param {string} type - One of `LEVEL_TYPES`.
   * @throws {Error} If `type` is not a valid level type.
   */
  constructor(type) {
    if (!Object.values(LEVEL_TYPES).includes(type)) {
      throw new Error(`Invalid level type: ${type}`);
    }

    this.#type = type;

    switch (this.#type) {
      case LEVEL_TYPES.NORMAL:
        this.#musicType = MUSIC.NORMAL;
        break;
      case LEVEL_TYPES.BOSS:
        this.#musicType = MUSIC.BOSS;
        break;
      case LEVEL_TYPES.RECOVERY:
        this.#musicType = MUSIC.RECOVERY;
        break;
    }
  }

  /**
   * Creates a level and populates its enemies (async, since enemies load their own spritesheets).
   *
   * @param {string} type - One of `LEVEL_TYPES`.
   * @returns {Promise<GameLevel>} The fully initialized level.
   */
  static async create(type) {
    const level = new this(type);
    await level.#createEnemies();
    return level;
  }

  get type() {
    return this.#type;
  }

  get enemies() {
    return this.#enemies;
  }

  get backgroundImage() {
    return `./img/level/${this.#type}_level.png`;
  }

  get backgroundMusicType() {
    return this.#musicType;
  }

  /**
   * Populates `#enemies` based on the level type.
   *
   * @returns {Promise<void>}
   */
  async #createEnemies() {
    switch (this.#type) {
      case LEVEL_TYPES.NORMAL:
        this.#enemies = await this.#createRandomEnemyGroup();
        break;
      case LEVEL_TYPES.BOSS:
        this.#enemies = [await BossEnemy.create()];
        break;
      case LEVEL_TYPES.RECOVERY:
        this.#enemies = [];
        break;
    }
  }

  /**
   * Creates one or two normal enemies for a normal-type level.
   *
   * @returns {Promise<NormalEnemy[]>}
   */
  async #createRandomEnemyGroup() {
    const enemyCount = Math.random() < 0.5 ? 1 : 2;
    const enemies = [];

    for (let i = 0; i < enemyCount; i++) {
      enemies.push(await NormalEnemy.create());
    }

    return enemies;
  }
}
