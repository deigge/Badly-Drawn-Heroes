import { player } from "../models/player.js";
import { drawMap, NODE_RADIUS } from "../utils/drawMap.js";
import { EntityRenderer } from "./EntityRenderer.js";

export class LevelSelectionUI {
  #ctx;
  #maps;
  #onSelect;
  #selectedIndex = 0;
  #playerRenderer = new EntityRenderer(player, "playerIdle");

  constructor(ctx, maps, onSelect) {
    this.#ctx = ctx;
    this.#maps = maps;
    this.#onSelect = onSelect;

    document.addEventListener("keydown", this.#handleKey);
    this.render();
  }

  #handleKey = (e) => {
    if (e.key === "ArrowUp")
      this.#selectedIndex = Math.max(0, this.#selectedIndex - 1);
    if (e.key === "ArrowDown")
      this.#selectedIndex = Math.min(
        this.#maps.length - 1,
        this.#selectedIndex + 1,
      );
    if (e.key === "Enter") {
      this.#onSelect(this.#selectedIndex);
      return;
    }
  };

  update(delta) {
    this.#playerRenderer.update(delta);
  }

  render() {
    const xStart = 450;
    const yStart = 120;

    let x = xStart;
    let y = yStart;

    const xSpacing = 80;
    const ySpacing = xSpacing + 20;

    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

    const playerCanvas = this.#playerRenderer.getFrame();
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

      //Cursor
      if (this.#selectedIndex == j) {
        this.#ctx.beginPath();
        this.#ctx.moveTo(cursorX, cursorY - 12); // oben links
        this.#ctx.lineTo(cursorX + 16, cursorY); // spitze rechts
        this.#ctx.lineTo(cursorX, cursorY + 12); // unten links
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
