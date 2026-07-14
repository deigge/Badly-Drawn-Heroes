import { player } from "../models/player.js";
import { drawMap, NODE_RADIUS } from "../utils/drawMap.js";
import { playSound, SOUND } from "../utils/sound.js";

/**
 * Renders the map-selection list and handles keyboard navigation/selection.
 * Purely presentational/input logic; delegates the actual selection
 * decision back to `LevelSelection` via the `onSelect` callback.
 */
export class LevelSelectionUI {
  #ctx;
  #maps;
  #onSelect;
  #selectedIndex = 0;

  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context to render into.
   * @param {import("../models/gameMap.js").GameMap[]} maps - Maps to choose from.
   * @param {(index: number) => void} onSelect - Called with the chosen map's index on confirm.
   */
  constructor(ctx, maps, onSelect) {
    this.#ctx = ctx;
    this.#maps = maps;
    this.#onSelect = onSelect;

    document.addEventListener("keydown", this.#handleKey);
    this.render();
  }

  /**
   * Handles up/down navigation and confirming the current selection.
   *
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  #handleKey = (e) => {
    if (e.key === "ArrowUp") {
      this.#selectedIndex = Math.max(0, this.#selectedIndex - 1);
      playSound(SOUND.CHANGE_SELECTION);
    }
    if (e.key === "ArrowDown") {
      this.#selectedIndex = Math.min(
        this.#maps.length - 1,
        this.#selectedIndex + 1,
      );
      playSound(SOUND.CHANGE_SELECTION);
    }
    if (e.key === "Enter") {
      this.#onSelect(this.#selectedIndex);
      playSound(SOUND.CONFIRM);
      return;
    }
  };

  update(delta) {
    player.renderer.update(delta);
  }

  /**
   * Draws the player preview and the list of selectable maps, including a
   * triangular cursor indicating the currently selected map.
   *
   * @returns {void}
   */
  render() {
    const xStart = 450;
    const yStart = 120;

    let x = xStart;
    let y = yStart;

    const xSpacing = 80;
    const ySpacing = xSpacing + 20;

    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    const playerCanvas = player.renderer.getFrame();
    if (playerCanvas) this.#ctx.drawImage(playerCanvas, 150, 150);

    for (let j = 0; j < this.#maps.length; j++) {
      const cursorX = x - 40;
      const cursorY = y + NODE_RADIUS;
      this.#ctx.clearRect(
        cursorX,
        cursorY - 15,
        x - 10,
        cursorY + ySpacing * 2 + 15,
      );

      // Cursor: small triangle pointing right, drawn only next to the selected map.
      if (this.#selectedIndex == j) {
        this.#ctx.beginPath();
        this.#ctx.moveTo(cursorX, cursorY - 12); // top-left
        this.#ctx.lineTo(cursorX + 16, cursorY); // tip (right)
        this.#ctx.lineTo(cursorX, cursorY + 12); // bottom-left
        this.#ctx.closePath();
        this.#ctx.fillStyle = "purple";
        this.#ctx.fill();
      }

      const mapCanvas = drawMap(this.#maps[j]);
      this.#ctx.drawImage(mapCanvas, x, y);

      y += ySpacing;
    }
  }

  destroy() {
    document.removeEventListener("keydown", this.#handleKey);
  }
}
