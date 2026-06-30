import { player } from "../models/player.js";

class PlayerRenderer {
  #player;
  #currentAnim;
  #currentFrame;
  #animTimer;
  #frameDuration;

  constructor() {
    this.#player = player;
    this.#currentAnim = null;
    this.#currentFrame = 0;
    this.#animTimer = 0;
    this.#frameDuration = 1000 / 5;
  }

  playAnimation(name) {
    const anim = this.#player.spritesheet.animations[name];
    if (this.#currentAnim === anim) return;
    this.#currentAnim = anim;
    this.#currentFrame = 0;
    this.#animTimer = 0;
  }

  update(delta) {
    if (!this.#currentAnim && this.#player.spritesheet) {
      this.#currentAnim = this.#player.spritesheet.animations["playerIdle"];
    }
    if (!this.#currentAnim) return;
    this.#animTimer += delta;
    if (this.#animTimer >= this.#frameDuration) {
      this.#currentFrame = (this.#currentFrame + 1) % this.#currentAnim.length;
      this.#animTimer = 0;
    }
  }

  getFrame() {
    if (!this.#player.spritesheet || !this.#currentAnim) return null;

    const frame = this.#currentAnim[this.#currentFrame];
    const canvas = document.createElement("canvas");
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      this.#player.spritesheet.image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      frame.width,
      frame.height,
    );

    return canvas;
  }
}

export const playerRenderer = new PlayerRenderer();
