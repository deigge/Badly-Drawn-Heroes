import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

export class BossEnemy extends Entity {
  constructor() {
    super(SpriteType.BOSS_ENEMY, 100, "enemyIdle", 10, 0.8);
  }
}
