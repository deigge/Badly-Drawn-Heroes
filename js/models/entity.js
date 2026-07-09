import { EntityRenderer } from "../ui/EntityRenderer.js";
import { SpriteSheetLoader } from "../utils/spritesheetLoader.js";

export class Entity {
  #spritesheet = null;
  #currentHealth;
  #maxHealth;
  #spriteType;
  #renderer;
  #attackPower = 20;
  #hitChance;

  constructor(
    spritetype,
    maxHealth,
    baseAnimationName,
    attackPower,
    hitChance = 1,
  ) {
    this.#spriteType = spritetype;

    this.#maxHealth = maxHealth;
    this.#currentHealth = this.#maxHealth;
    this.#attackPower = attackPower;
    this.#hitChance = hitChance;
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

  get attackPower() {
    return this.#attackPower;
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

  dealDamageTo(target, multiplier = 1) {
    const hits = Math.random() < this.#hitChance;
    if (!hits) return;

    const damage = Math.round(this.#attackPower * multiplier);
    const damageDealt = target.takeDamage(damage);
  }

  get isDead() {
    return this.#currentHealth <= 0;
  }
}
