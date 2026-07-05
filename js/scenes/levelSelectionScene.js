import { LevelSelectionUI } from "../ui/levelSelectionUI.js";
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
  }

  static async create(ctx, switcher) {
    const levelSelection = new this(ctx, switcher);
    await levelSelection.#createMaps();

    levelSelection.#ui = new LevelSelectionUI(
      ctx,
      levelSelection.#maps,
      (index) => levelSelection.#mapSelected(index),
    );

    return levelSelection;
  }

  async #createMaps() {
    for (let i = 0; i < 3; i++) this.#maps.push(await GameMap.create());
  }

  #mapSelected(index) {
    GameState.map = this.#maps[index];
    this.#switcher.notify("game");
  }

  update(delta) {
    this.#ui.update(delta);
  }

  render(ctx) {
    this.#ui.render(ctx);
  }

  destroy() {
    this.#ui.destroy();
  }
}
