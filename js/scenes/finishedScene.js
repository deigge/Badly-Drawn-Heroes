import { Scene } from "../core/scene.js";
import { GameState } from "../models/gameState.js";
import { drawMap } from "../utils/drawMap.js";
import { MUSIC, playMusic, stopMusic } from "../utils/music.js";
import { updateHighscore } from "../utils/scores.js";
import { playSound, SOUND } from "../utils/sound.js";

export class FinishedScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;

  #frame = 0;
  #finishA = new Image();
  #finishB = new Image();

  constructor(ctx, switcher) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;

    this.#mapCanvas = drawMap(GameState.map);

    this.#finishA.src = "../img/ui/finish_screen_a.png";
    this.#finishB.src = "../img/ui/finish_screen_b.png";

    playMusic(MUSIC.VICTORY);

    updateHighscore();

    document.getElementById("restartButton").hidden = false;

    document.getElementById("restartButton").addEventListener("click", () => {
      document.getElementById("restartButton").hidden = true;
      stopMusic();
      playSound(SOUND.CONFIRM);
      GameState.reset();
      this.#switcher.notify("levelSelection");
    });
  }

  update(delta) {}

  render() {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    const y = 50;

    this.#ctx.clearRect(
      this.#ctx.canvas.width / 2 - this.#finishA.width / 2,
      y,
      this.#finishA.width,
      this.#finishA.height,
    );

    this.#frame++;
    const img =
      Math.floor(this.#frame / 30) % 2 === 0 ? this.#finishA : this.#finishB;

    this.#ctx.drawImage(
      img,
      this.#ctx.canvas.width / 2 - this.#finishA.width / 2,
      y,
    );

    this.#ctx.drawImage(
      this.#mapCanvas,
      this.#ctx.canvas.width / 2 - this.#mapCanvas.width / 2,
      y + this.#finishA.height * 1.1,
    );
  }

  destroy() {}
}
