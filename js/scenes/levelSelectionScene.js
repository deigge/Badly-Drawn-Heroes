import { LevelSelectionUI } from "../levelSelectionUI.js";
import { GameState } from "../models/gameState.js";
import { GameMap } from "../models/gameMap.js";
import { Scene } from "../core/scene.js";

export class LevelSelection extends Scene {
  #maps = [];
  #ui;
  #switcher;

  constructor(ctx, switcher) {
    super();

    this.#switcher = switcher;

    for (let i = 0; i < 3; i++) this.#maps.push(new GameMap());
    this.#ui = new LevelSelectionUI(ctx, this.#maps, (index) =>
      this.#mapSelected(index),
    );
  }

  #mapSelected(index) {
    GameState.map = this.#maps[index];
    this.#switcher.notify("game");
  }

  update() {}

  render(ctx) {
    this.#ui.render(ctx);
  }

  destroy() {
    this.#ui.destroy();
  }
}
