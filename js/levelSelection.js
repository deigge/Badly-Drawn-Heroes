import { LevelSelectionUI } from "./levelSelectionUI.js";
import { GameState } from "./gameState.js";
import { GameMap } from "./gameMap.js";
import { Scene } from "./core/scene.js";

export class LevelSelection extends Scene {
  #maps = [];
  #ui;

  constructor(ctx) {
    super();
    for (let i = 0; i < 3; i++) this.#maps.push(new GameMap());
    this.#ui = new LevelSelectionUI(ctx, this.#maps, (index) =>
      GameState.setMap(this.#maps[index]),
    );
  }

  update() {
    // Input / logic
  }

  render(ctx) {
    this.#ui.render(ctx);
  }
}
