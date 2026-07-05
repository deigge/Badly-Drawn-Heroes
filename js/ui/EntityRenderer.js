import { frameToCanvas } from "../utils/frameToCanvas.js";

export class EntityRenderer {
  #entity;
  #currentAnimName;
  #currentFrame;
  #animTimer;
  #frameDuration;

  constructor(entity, standardAnimation) {
    this.#entity = entity;
    this.#currentAnimName = standardAnimation;
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
    if (!this.#currentAnimName || !this.#entity.spritesheet) return;

    const anim = this.#entity.spritesheet.groups[this.#currentAnimName];
    if (!anim) return;

    this.#animTimer += delta;
    if (this.#animTimer >= this.#frameDuration) {
      this.#currentFrame = (this.#currentFrame + 1) % anim.length;
      this.#animTimer = 0;
    }
  }

  getFrame() {
    if (!this.#entity.spritesheet || !this.#currentAnimName) return null;

    const frame = this.#entity.spritesheet.getFrame(
      this.#currentAnimName,
      this.#currentFrame,
    );
    return frameToCanvas(this.#entity.spritesheet.image, frame);
  }
}
