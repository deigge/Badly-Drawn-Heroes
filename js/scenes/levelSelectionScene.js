import { LevelSelectionUI } from "../ui/levelSelectionUI.js";
import { GameState } from "../models/gameState.js";
import { GameMap } from "../models/gameMap.js";
import { Scene } from "../core/scene.js";

/**
 * The map-selection screen shown at the start of a run. Generates a fixed
 * number of maps to choose from and delegates input handling/rendering to
 * `LevelSelectionUI`; on selection, stores the chosen map in `GameState`
 * and starts the game.
 */
export class LevelSelection extends Scene {
  #maps = [];
  #ui;
  #switcher;

  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context to render into.
   * @param {import("../core/sceneSwitcher.js").SceneSwitcher} switcher - Used to notify when a map is selected.
   */
  constructor(ctx, switcher) {
    super();

    this.#switcher = switcher;
  }

  /**
   * Creates the scene and generates its maps before wiring up the UI, since
   * map generation is async (each map creates its own levels/enemies).
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {import("../core/sceneSwitcher.js").SceneSwitcher} switcher
   * @returns {Promise<LevelSelection>} The fully initialized scene.
   */
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

  /**
   * Generates the fixed set of selectable maps.
   *
   * @returns {Promise<void>}
   */
  async #createMaps() {
    for (let i = 0; i < 3; i++) this.#maps.push(await GameMap.create());
  }

  /**
   * Called when the player confirms a map choice. Stores the map and
   * transitions to the game scene.
   *
   * @param {number} index - Index of the selected map.
   * @returns {void}
   */
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
