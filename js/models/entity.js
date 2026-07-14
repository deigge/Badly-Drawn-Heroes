import { EntityRenderer } from "../ui/EntityRenderer.js";
import { spriteSheetLoader } from "../utils/spritesheetLoader.js";

/**
 * Base class for anything that fights in combat (player and enemies).
 * Holds health, combat stats, its spritesheet, and a renderer for animations.
 * Subclasses (`Player`, `NormalEnemy`, `BossEnemy`) just configure the stats
 * passed to the constructor.
 */
export class Entity {
  #spritesheet = null;
  #currentHealth;
  #maxHealth;
  #spriteType;
  #renderer;
  #attackPower = 20;
  #hitChance;

  /**
   * @param {string} spritetype - Sprite type key used to load the entity's spritesheet (see `SpriteType`).
   * @param {number} maxHealth - Maximum (and starting) health.
   * @param {string} baseAnimationName - Name of the idle animation to render by default.
   * @param {number} attackPower - Base damage dealt per successful hit.
   * @param {number} [hitChance=1] - Probability (0–1) that an attack lands.
   */
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

  /**
   * Loads the entity's spritesheet. Called by `create()`; not usually invoked directly.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.#spritesheet = await spriteSheetLoader.load(this.#spriteType);
  }

  /**
   * Creates and fully initializes an entity (including its spritesheet).
   * Use this instead of `new` directly, since loading the spritesheet is async.
   *
   * @returns {Promise<Entity>} The initialized instance.
   */
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

  /**
   * Reduces current health by the given amount, clamped at 0.
   *
   * @param {number} damage - Amount of damage to apply.
   * @returns {void}
   */
  takeDamage(damage) {
    this.#currentHealth = Math.max(0, this.#currentHealth - damage);
  }

  /**
   * Attempts to deal damage to a target, factoring in this entity's hit chance.
   *
   * @param {Entity} target - The entity to attack.
   * @param {number} [multiplier=1] - Damage multiplier (e.g. from attack accuracy tier).
   * @returns {void}
   */
  dealDamageTo(target, multiplier = 1) {
    const hits = Math.random() < this.#hitChance;
    if (!hits) return;

    const damage = Math.round(this.#attackPower * multiplier);
    target.takeDamage(damage);
  }

  /**
   * Restores health, clamped at `maxHealth`.
   *
   * @param {number} amount - Amount of health to restore.
   * @returns {void}
   */
  heal(amount) {
    this.#currentHealth = Math.min(
      this.#maxHealth,
      this.#currentHealth + amount,
    );
  }

  get isDead() {
    return this.#currentHealth <= 0;
  }
}
