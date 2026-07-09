import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

class Player extends Entity {
  #damageTakenMultiplier = 1;

  constructor() {
    super(SpriteType.PLAYER, 100, "playerIdle", 20);
  }

  set damageTakenMultiplier(mp) {
    this.#damageTakenMultiplier = mp;
  }

  resetDamageTakenMultiplier() {
    this.#damageTakenMultiplier = 1;
  }

  takeDamage(damage) {
    const reduced = Math.round(damage * this.#damageTakenMultiplier);
    return super.takeDamage(reduced);
  }
}

export const player = await Player.create();
