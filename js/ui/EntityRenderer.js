import { frameToCanvas } from "../utils/frameToCanvas.js";

/**
 * Drives sprite animation playback for an `Entity`: tracks the current
 * animation, advances frames over time, and supports both looping
 * animations (e.g. idle) and finite ones that play a fixed number of times
 * before invoking a callback (e.g. an attack animation).
 */
export class EntityRenderer {
  #entity;
  #currentAnimName;
  #currentFrame;
  #animTimer;
  #frameDuration;
  #onceCallback;
  #playingOnce;
  #repeatsLeft;

  /**
   * @param {import("../models/entity.js").Entity} entity - The entity being rendered.
   * @param {string} standardAnimation - Name of the default (looping) animation to start with.
   */
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

  /**
   * Switches to a looping animation. No-op if it's already playing.
   *
   * @param {string} name - Animation/frame-group name.
   * @returns {void}
   */
  playAnimation(name) {
    if (this.#currentAnimName === name) return;
    this.#currentAnimName = name;
    this.#currentFrame = 0;
    this.#animTimer = 0;
  }

  /**
   * Plays an animation a fixed number of times, then invokes `callback`
   * and leaves the renderer on the last frame (until `playAnimation` is
   * called again).
   *
   * @param {string} name - Animation/frame-group name.
   * @param {() => void} callback - Invoked once all repeats have finished.
   * @param {number} [repeats=1] - How many times to play the animation.
   * @returns {void}
   */
  playFinite(name, callback, repeats = 1) {
    this.#currentAnimName = name;
    this.#currentFrame = 0;
    this.#animTimer = 0;
    this.#playingOnce = true;
    this.#onceCallback = callback;
    this.#repeatsLeft = repeats;
  }

  /**
   * Advances the animation by `delta` milliseconds, moving to the next
   * frame once `#frameDuration` has elapsed. Handles both looping playback
   * and finite (repeat-limited) playback with a completion callback.
   *
   * @param {number} delta - Time elapsed since the last update, in milliseconds.
   * @returns {void}
   */
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
            // All repeats done -> stay on the last frame and fire the callback.
            this.#playingOnce = false;
            const cb = this.#onceCallback;
            this.#onceCallback = null;
            if (cb) cb();
          } else {
            this.#currentFrame = 0; // restart the animation for the next repeat
          }
        } else {
          this.#currentFrame = 0; // normal looping (idle, etc.)
        }
      } else {
        this.#currentFrame = nextFrame;
      }
    }
  }

  /**
   * Renders the current animation frame to a canvas.
   *
   * @returns {HTMLCanvasElement | null} The rendered frame, or `null` if no spritesheet/animation is set yet.
   */
  getFrame() {
    if (!this.#entity.spritesheet || !this.#currentAnimName) return null;

    const frame = this.#entity.spritesheet.getFrame(
      this.#currentAnimName,
      this.#currentFrame,
    );
    return frameToCanvas(this.#entity.spritesheet.image, frame);
  }
}
