import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

export class NormalEnemy extends Entity {
  constructor() {
    super(SpriteType.NORMAL_ENEMY, 100, "enemyIdle", 5, 0.7);
  }
}
