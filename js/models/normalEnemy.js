import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

/**
 * A regular enemy encountered on normal levels.
 */
export class NormalEnemy extends Entity {
  constructor() {
    super(SpriteType.NORMAL_ENEMY, 80, "enemyIdle", 5, 0.7);
  }
}
