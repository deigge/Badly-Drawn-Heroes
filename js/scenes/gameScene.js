import { Scene } from "../core/scene.js";
import { GameState } from "../models/gameState.js";
import { drawMap } from "../utils/drawMap.js";
import { playerRenderer } from "../ui/playerRenderer.js";
import { player } from "../models/player.js";
import { drawHealthbar } from "../utils/drawHealthbar.js";
import { Colors } from "../utils/colors.js";
import { Attacks } from "../models/attacks.js";
import { AttackCanvas } from "../ui/attackCanvas.js";
import { Timer } from "../utils/timer.js";
import { scoreAttack } from "../utils/scoreAttack.js";

export class GameScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;
  #background = new Image();
  #attackCanvas;
  #attacks;
  #attackTimer = new Timer(6);

  constructor(ctx, switcher, attackCanvas) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;
    this.#attackCanvas = attackCanvas;

    this.#mapCanvas = drawMap(GameState.map, 0);
    this.#changeBackground();

    this.#attacks = new Attacks();
    this.#attacks.init();

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
    } else if (e.code === "Space") {
      this.loadAttack();
      return;
    }
    this.render();
  };

  #changeBackground() {
    this.#background.src = GameState.map.currentLevel.backgroundImage;
  }

  update(delta) {
    playerRenderer.update(delta);
  }

  render() {
    this.#ctx.drawImage(this.#background, 0, 0);

    const playerCanvas = playerRenderer.getFrame();
    this.#ctx.drawImage(playerCanvas, 150, 250);

    const healthbarCanvas = drawHealthbar(
      player.currentHealth,
      player.maxHealth,
      Colors.level.normal,
    );
    this.#ctx.drawImage(healthbarCanvas, 150, this.#ctx.canvas.height - 50);

    this.#ctx.drawImage(
      this.#mapCanvas,
      this.#ctx.canvas.width / 2 - this.#mapCanvas.width / 2,
      30,
    );
  }

  loadAttack() {
    const attackIcon = this.#attacks.getRandomLightAttack();
    this.#attackCanvas.drawSprite(attackIcon);
    this.#attackCanvas.enableDrawing();

    let timer = document.getElementById("drawTimer");
    timer.style.visibility = "visible";

    this.#attackTimer.start(
      (remaining) => {
        timer.textContent = remaining;
      },
      () => {
        timer.style.visibility = "hidden";
        const { picCanvas, drawCanvas } = this.#attackCanvas.getBothCanvas();
        const damageTier = scoreAttack(picCanvas, drawCanvas);

        this.#attackCanvas.disableDrawing();
        this.#attackCanvas.clear();
      },
    );
  }

  destroy() {
    document.removeEventListener("keydown", this.#handleKey);
  }
}
