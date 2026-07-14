import { spriteSheetLoader, SpriteType } from "../utils/spritesheetLoader.js";
import { frameToCanvas } from "../utils/frameToCanvas.js";

/**
 * Provides random light/heavy attack icons drawn from the shared attacks
 * spritesheet, used to display the drawing template during a combat action.
 */
export class Attacks {
  #spritesheet;

  /**
   * Loads the attacks spritesheet. Must be called (and awaited) before any
   * `getRandom*Attack()` method is used.
   *
   * @returns {Promise<void>}
   */
  async init() {
    this.#spritesheet = await spriteSheetLoader.load(SpriteType.ATTACKS);
  }

  /**
   * Picks a random frame from the given group and renders it to a canvas.
   *
   * @param {string} frameName - Name of the frame group (e.g. "light", "heavy").
   * @returns {HTMLCanvasElement} Canvas containing the rendered attack icon.
   * @throws {Error} If `init()` hasn't completed yet.
   */
  #getRandomAttack(frameName) {
    if (!this.#spritesheet) {
      throw new Error("Attacks not initialized yet – call init() first");
    }
    const frame = this.#spritesheet.getRandomFrame(frameName);

    return frameToCanvas(this.#spritesheet.image, frame);
  }

  /**
   * @returns {HTMLCanvasElement} A random light attack icon.
   */
  getRandomLightAttack() {
    return this.#getRandomAttack("light");
  }

  /**
   * @returns {HTMLCanvasElement} A random heavy attack icon.
   */
  getRandomHeavyAttack() {
    return this.#getRandomAttack("heavy");
  }
}
