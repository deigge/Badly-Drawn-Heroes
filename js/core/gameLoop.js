import { DebugOverlay } from "../utils/debugOverlay.js";

let frame = 0;
let lastTime = 0;
let fps = 0;

export class GameLoop {
  constructor(scene, ctx) {
    this.scene = scene;
    this.ctx = ctx;

    this.debug = new DebugOverlay();
  }

  setScene(scene) {
    this.scene.destroy?.();
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.scene = scene;
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop(time) {
    const delta = time - lastTime;
    lastTime = time;

    fps = Math.round(1000 / delta);
    frame++;

    // 1. UPDATE
    this.scene.update(delta);

    // 2. RENDER
    this.scene.render();

    // 3. DEBUG OUTPUT (DIV)
    this.debug.update({
      fps,
      frame,
      delta,
      sceneName: this.scene.constructor.name,
    });

    requestAnimationFrame(this.loop.bind(this));
  }
}
