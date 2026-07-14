import { DebugOverlay } from "../utils/debugOverlay.js";

let frame = 0;
let lastTime = 0;
let fps = 0;

/**
 * Drives the main game loop: repeatedly updates and renders the current
 * scene via `requestAnimationFrame`, and reports debug info (FPS, frame count).
 */
export class GameLoop {
  /**
   * @param {import("../scenes/scene.js").Scene} scene - The initial scene to run.
   * @param {CanvasRenderingContext2D} ctx - Canvas context the scene renders into.
   */
  constructor(scene, ctx) {
    this.scene = scene;
    this.ctx = ctx;

    this.debug = new DebugOverlay();
  }

  /**
   * Replaces the currently running scene with a new one, cleaning up the
   * old scene and clearing the canvas first.
   *
   * @param {import("../scenes/scene.js").Scene} scene - The scene to switch to.
   * @returns {void}
   */
  setScene(scene) {
    this.scene.destroy?.();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.scene = scene;
  }

  /**
   * Starts the game loop by scheduling the first animation frame.
   *
   * @returns {void}
   */
  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Single iteration of the game loop, called once per animation frame.
   * Updates and renders the current scene, then schedules the next frame.
   *
   * @param {DOMHighResTimeStamp} time - Timestamp provided by `requestAnimationFrame`.
   * @returns {void}
   */
  loop(time) {
    const delta = time - lastTime;
    lastTime = time;

    fps = Math.round(1000 / delta);
    frame++;

    this.scene.update(delta);

    this.scene.render();

    this.debug.update({
      fps,
      frame,
      delta,
      sceneName: this.scene.constructor.name,
    });

    requestAnimationFrame(this.loop.bind(this));
  }
}
