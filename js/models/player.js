import { SpriteSheetLoader, Character } from "../utils/spritesheetLoader.js";

class Player {
  #spritesheet;
  #currentHealth;
  #maxHealth = 100;

  constructor() {
    this.#spritesheet = null;
    this.#currentHealth = this.#maxHealth;

    this.init();
  }

  async init() {
    const loader = new SpriteSheetLoader();
    this.#spritesheet = await loader.load(Character.PLAYER);
  }

  get spritesheet() {
    return this.#spritesheet;
  }

  get maxHealth() {
    return this.#maxHealth;
  }

  get currentHealth() {
    return this.#currentHealth;
  }

  set currentHealth(health) {
    this.#currentHealth = health;
  }
}

export const player = new Player();
