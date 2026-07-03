import { player } from "../models/player.js";
import { frameToCanvas } from "../utils/frameToCanvas.js";

class PlayerRenderer {
  #player;
  #currentAnimName;
  #currentFrame;
  #animTimer;
  #frameDuration;

  constructor() {
    this.#player = player;
    this.#currentAnimName = null;
    this.#currentFrame = 0;
    this.#animTimer = 0;
    this.#frameDuration = 200;
  }

  playAnimation(name) {
    if (this.#currentAnimName === name) return;
    this.#currentAnimName = name;
    this.#currentFrame = 0;
    this.#animTimer = 0;
  }

  update(delta) {
    if (!this.#currentAnimName && this.#player.spritesheet) {
      this.#currentAnimName = "playerIdle";
    }

    if (!this.#currentAnimName || !this.#player.spritesheet) return;

    const anim = this.#player.spritesheet.groups[this.#currentAnimName];
    if (!anim) return;

    this.#animTimer += delta;
    if (this.#animTimer >= this.#frameDuration) {
      this.#currentFrame = (this.#currentFrame + 1) % anim.length;
      this.#animTimer = 0;
    }
  }

  getFrame() {
    if (!this.#player.spritesheet || !this.#currentAnimName) return null;

    const frame = this.#player.spritesheet.getFrame(
      this.#currentAnimName,
      this.#currentFrame,
    );
    return frameToCanvas(this.#player.spritesheet.image, frame);
  }
}

export const playerRenderer = new PlayerRenderer();
