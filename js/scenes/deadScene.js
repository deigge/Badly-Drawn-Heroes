import { Scene } from "../core/scene.js";
import { GameState } from "../models/gameState.js";
import { drawMap } from "../utils/drawMap.js";
import { MUSIC, playMusic } from "../utils/music.js";
import { updateHighscore } from "../utils/scores.js";

export class DeadScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;

  #frame = 0;
  #deadA = new Image();
  #deadB = new Image();

  constructor(ctx, switcher) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;

    this.#mapCanvas = drawMap(GameState.map, GameState.map.currentLevelIndex);

    this.#deadA.src = "../img/ui/dead_screen_a.png";
    this.#deadB.src = "../img/ui/dead_screen_b.png";

    playMusic(MUSIC.GAME_OVER);

    updateHighscore();
  }

  update(delta) {}

  render() {
    const y = 50;

    this.#ctx.clearRect(
      this.#ctx.canvas.width / 2 - this.#deadA.width / 2,
      y,
      this.#deadA.width,
      this.#deadA.height,
    );

    this.#frame++;
    const img =
      Math.floor(this.#frame / 30) % 2 === 0 ? this.#deadA : this.#deadB;

    this.#ctx.drawImage(
      img,
      this.#ctx.canvas.width / 2 - this.#deadA.width / 2,
      y,
    );

    this.#ctx.drawImage(
      this.#mapCanvas,
      this.#ctx.canvas.width / 2 - this.#mapCanvas.width / 2,
      y + this.#deadA.height * 1.1,
    );
  }

  destroy() {}
}
