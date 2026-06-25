import { DebugOverlay } from "./debugOverlay.js";

let frame = 0;
let lastTime = 0;
let fps = 0;

export class GameLoop {
  constructor(scene, ctx) {
    this.scene = scene;
    this.ctx = ctx;

    this.debug = new DebugOverlay();
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
    this.scene.render(this.ctx);

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
