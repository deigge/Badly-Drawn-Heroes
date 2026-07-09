import { frameToCanvas } from "../utils/frameToCanvas.js";

export class EntityRenderer {
  #entity;
  #currentAnimName;
  #currentFrame;
  #animTimer;
  #frameDuration;
  #onceCallback;
  #playingOnce;
  #repeatsLeft;

  constructor(entity, standardAnimation) {
    this.#entity = entity;
    this.#currentAnimName = standardAnimation;
    this.#currentFrame = 0;
    this.#animTimer = 0;
    this.#frameDuration = 200;
    this.#onceCallback = null;
    this.#playingOnce = false;
    this.#repeatsLeft = 0;
  }

  playAnimation(name) {
    if (this.#currentAnimName === name) return;
    this.#currentAnimName = name;
    this.#currentFrame = 0;
    this.#animTimer = 0;
  }

  playFinite(name, callback, repeats = 1) {
    this.#currentAnimName = name;
    this.#currentFrame = 0;
    this.#animTimer = 0;
    this.#playingOnce = true;
    this.#onceCallback = callback;
    this.#repeatsLeft = repeats;
  }

  update(delta) {
    if (!this.#currentAnimName || !this.#entity.spritesheet) return;

    const anim = this.#entity.spritesheet.groups[this.#currentAnimName];
    if (!anim) return;

    this.#animTimer += delta;
    if (this.#animTimer >= this.#frameDuration) {
      this.#animTimer = 0;
      const nextFrame = this.#currentFrame + 1;

      if (nextFrame >= anim.length) {
        if (this.#playingOnce) {
          this.#repeatsLeft--;
          if (this.#repeatsLeft <= 0) {
            // alle Durchläufe fertig -> stehen bleiben, callback feuern
            this.#playingOnce = false;
            const cb = this.#onceCallback;
            this.#onceCallback = null;
            if (cb) cb();
          } else {
            this.#currentFrame = 0; // nochmal von vorne
          }
        } else {
          this.#currentFrame = 0; // normales loopen (idle etc.)
        }
      } else {
        this.#currentFrame = nextFrame;
      }
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
