import { SpriteType } from "../utils/spritesheetLoader.js";
import { Entity } from "./entity.js";

class Player extends Entity {
  constructor() {
    super(SpriteType.PLAYER, 100, "playerIdle", 20);
  }
}

export const player = await Player.create();
