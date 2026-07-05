import { EntityRenderer } from "../ui/EntityRenderer.js";
import { SpriteSheetLoader } from "../utils/spritesheetLoader.js";

export class Entity {
  #spritesheet = null;
  #currentHealth;
  #maxHealth;
  #spriteType;
  #renderer;
  #baseAttack = 20;

  constructor(spritetype, maxHealth, baseAnimationName) {
    this.#spriteType = spritetype;

    this.#maxHealth = maxHealth;
    this.#currentHealth = this.#maxHealth;
    this.#renderer = new EntityRenderer(this, baseAnimationName);
  }

  async init() {
    const loader = new SpriteSheetLoader();
    this.#spritesheet = await loader.load(this.#spriteType);
  }

  static async create() {
    const instance = new this();
    await instance.init();
    return instance;
  }

  get spritesheet() {
    return this.#spritesheet;
  }

  get maxHealth() {
    return this.#maxHealth;
  }

  get baseAttack() {
    return this.#baseAttack;
  }

  get renderer() {
    return this.#renderer;
  }

  get currentHealth() {
    return this.#currentHealth;
  }

  set currentHealth(health) {
    this.#currentHealth = health;
  }

  takeDamage(damage) {
    this.#currentHealth = Math.max(0, this.#currentHealth - damage);
  }

  get isDead() {
    return this.#currentHealth <= 0;
  }
}
