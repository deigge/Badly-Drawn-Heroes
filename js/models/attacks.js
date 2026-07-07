import { SpriteSheetLoader, SpriteType } from "../utils/spritesheetLoader.js";
import { frameToCanvas } from "../utils/frameToCanvas.js";

export class Attacks {
  #spritesheet;

  async init() {
    const loader = new SpriteSheetLoader();
    this.#spritesheet = await loader.load(SpriteType.ATTACKS);
  }

  #getRandomAttack(frameName) {
    if (!this.#spritesheet) {
      throw new Error("Attacks not initialized yet – call init() first");
    }
    const frame = this.#spritesheet.getRandomFrame(frameName);

    return frameToCanvas(this.#spritesheet.image, frame);
  }

  getRandomLightAttack() {
    return this.#getRandomAttack("light");
  }

  getRandomHeavyAttack() {
    return this.#getRandomAttack("heavy");
  }
}
