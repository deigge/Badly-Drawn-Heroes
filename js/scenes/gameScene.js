import { Scene } from "../core/scene.js";
import { GameState } from "../models/gameState.js";
import { drawMap } from "../utils/drawMap.js";

export class GameScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;
  #background = new Image();

  constructor(ctx, switcher) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;

    this.#mapCanvas = drawMap(GameState.map, 0);
    this.#changeBackground();

    document.addEventListener("keydown", this.#handleKey);
  }

  #handleKey = (e) => {
    if (e.key === "Enter") {
      const nextLevel = GameState.map.nextLevel;

      if (nextLevel != null) {
        this.#mapCanvas = drawMap(
          GameState.map,
          GameState.map.currentLevelIndex,
        );
        this.#changeBackground();
      } else {
        this.#switcher.notify("finished");
      }
      return;
    } else if (e.key === "Backspace") {
      this.#switcher.notify("dead");
      return;
    }
    this.render();
  };

  #changeBackground() {
    this.#background.src = GameState.map.currentLevel.backgroundImage;
  }

  update() {
    // Spiellogik
  }

  render() {
    this.#ctx.drawImage(this.#background, 0, 0);
    this.#ctx.drawImage(
      this.#mapCanvas,
      this.#ctx.canvas.width / 2 - this.#mapCanvas.width / 2,
      30,
    );
  }

  destroy() {
    document.removeEventListener("keydown", this.#handleKey);
  }
}
