import { MUSIC } from "../utils/music.js";
import { NormalEnemy } from "./normalEnemy.js";

export const LEVEL_TYPES = {
  NORMAL: "normal",
  BOSS: "boss",
  RECOVERY: "recovery",
};

export class GameLevel {
  #type;
  #enemies;
  #musicType;

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

  async #createEnemies() {
    switch (this.#type) {
      case LEVEL_TYPES.NORMAL:
        this.#enemies = await this.#createRandomEnemyGroup();
        break;
      case LEVEL_TYPES.BOSS:
        this.#enemies = []; // TODO: BossEnemy.create()
        break;
      case LEVEL_TYPES.RECOVERY:
        this.#enemies = [];
        break;
    }
  }

  async #createRandomEnemyGroup() {
    const enemyCount = Math.random() < 0.5 ? 1 : 2;
    const enemies = [];

    for (let i = 0; i < enemyCount; i++) {
      enemies.push(await NormalEnemy.create());
    }

    return enemies;
  }
}
