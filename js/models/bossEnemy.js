import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

/**
 * A boss-level enemy. Stronger and more accurate than a `NormalEnemy`.
 */
export class BossEnemy extends Entity {
  constructor() {
    super(SpriteType.BOSS_ENEMY, 200, "enemyIdle", 10, 0.8);
  }
}
