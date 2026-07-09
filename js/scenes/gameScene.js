import { Scene } from "../core/scene.js";
import { GameState } from "../models/gameState.js";
import { drawMap } from "../utils/drawMap.js";
import { player } from "../models/player.js";
import { drawHealthbar } from "../utils/drawHealthbar.js";
import { Colors } from "../utils/colors.js";
import { Attacks } from "../models/attacks.js";
import { Timer } from "../utils/timer.js";
import { scoreAttack } from "../utils/scoreAttack.js";
import {
  pointsForAttack,
  pointsForLevelCompletion,
} from "../utils/highscoreCalc.js";

export class GameScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;
  #background = new Image();
  #attackCanvas;
  #attacks;
  #attackTimer = new Timer(6);
  #currentScoreElement;

  constructor(ctx, switcher, attackCanvas) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;
    this.#attackCanvas = attackCanvas;

    this.#mapCanvas = drawMap(GameState.map, 0);
    this.#changeBackground();

    this.#attacks = new Attacks();
    this.#attacks.init();

    this.#currentScoreElement = document.getElementById("currentScore");

    document
      .getElementById("lightAttack")
      .addEventListener("click", () => this.#loadAttack(true));

    this.#enableButtons();

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
      this.#loadAttack(false);
      return;
    } else if (e.key === "z") {
      GameState.map.currentLevel.enemies[0].renderer.playOnce(
        "enemyAttack",
        () => {
          GameState.map.currentLevel.enemies[0].renderer.playAnimation(
            "enemyIdle",
          );
        },
      );
    }
  };

  #changeBackground() {
    this.#background.src = GameState.map.currentLevel.backgroundImage;
  }

  update(delta) {
    if (player.isDead) this.#switcher.notify("dead");

    player.renderer.update(delta);

    GameState.map.currentLevel.enemies.forEach((enemy) => {
      enemy.renderer.update(delta);
    });
  }

  render() {
    this.#ctx.drawImage(this.#background, 0, 0);

    const playerCanvas = player.renderer.getFrame();
    this.#ctx.drawImage(playerCanvas, 150, 250);

    const healthbarCanvas = drawHealthbar(
      player.currentHealth,
      player.maxHealth,
      Colors.level.normal,
    );
    this.#ctx.drawImage(healthbarCanvas, 150, this.#ctx.canvas.height - 50);

    let enemyX = 600;

    GameState.map.currentLevel.enemies.forEach((enemy) => {
      const enemyCanvas = enemy.renderer.getFrame();

      const enemyY = this.#ctx.canvas.height - enemyCanvas.height - 80;
      this.#ctx.drawImage(enemyCanvas, enemyX, enemyY);

      const healthbarCanvas = drawHealthbar(
        enemy.currentHealth,
        enemy.maxHealth,
        Colors.level.boss,
      );
      this.#ctx.drawImage(
        healthbarCanvas,
        enemyX,
        this.#ctx.canvas.height - 50,
      );

      enemyX += enemyCanvas.width + 50;
    });

    this.#ctx.drawImage(
      this.#mapCanvas,
      this.#ctx.canvas.width / 2 - this.#mapCanvas.width / 2,
      30,
    );
  }

  #loadAttack(isLightAttack) {
    let attackIcon;
    attackIcon = isLightAttack
      ? this.#attacks.getRandomLightAttack()
      : this.#attacks.getRandomHeavyAttack();

    this.#attackCanvas.drawSprite(attackIcon);
    this.#attackCanvas.enableDrawing();

    let timer = document.getElementById("drawTimer");
    timer.style.visibility = "visible";

    player.renderer.playAnimation("playerAttack");

    this.#attackTimer.start(
      (remaining) => {
        timer.textContent = remaining;
      },
      () => {
        player.renderer.playAnimation("playerIdle");

        timer.style.visibility = "hidden";
        const { picCanvas, drawCanvas } = this.#attackCanvas.getBothCanvas();
        let damageTier = scoreAttack(picCanvas, drawCanvas);

        GameState.addToScore(pointsForAttack(damageTier, isLightAttack));
        this.#updateScore();

        if (!isLightAttack) damageTier *= 2;

        this.#attackCanvas.clear();

        this.#attackCanvas.drawScore(damageTier);

        const enemies = GameState.map.currentLevel.enemies;
        const target = enemies[0];
        if (target) {
          player.dealDamageTo(target, damageTier);
          if (target.isDead) {
            enemies.shift();
            if (enemies.length === 0) {
              this.#nextLevel();
            }
          }
        }

        this.#attackCanvas.disableDrawing();

        this.#disableButtons();
        this.#enemyAttack(GameState.map.currentLevel.enemies);
      },
    );
  }

  #enemyAttack(enemies, index = 0) {
    if (index >= enemies.length) {
      this.#enableButtons();
      return;
    }
    const enemy = enemies[index];
    enemy.renderer.playFinite(
      "enemyAttack",
      () => {
        enemy.dealDamageTo(player);
        enemy.renderer.playAnimation("enemyIdle");
        this.#enemyAttack(enemies, index + 1);
      },
      2,
    );
  }

  #nextLevel() {
    GameState.addToScore(
      pointsForLevelCompletion(GameState.map.currentLevel.type),
    );
    this.#updateScore();
    const nextLevel = GameState.map.nextLevel;

    if (nextLevel != null) {
      this.#mapCanvas = drawMap(GameState.map, GameState.map.currentLevelIndex);
      this.#changeBackground();
    } else {
      this.#switcher.notify("finished");
    }
  }

  #updateScore() {
    this.#currentScoreElement.textContent = GameState.score;
  }

  #disableButtons() {
    document.querySelectorAll(".interactionButton").forEach((button) => {
      button.disabled = true;
    });
  }

  #enableButtons() {
    document.querySelectorAll(".interactionButton").forEach((button) => {
      button.disabled = false;
    });
  }

  destroy() {
    document.removeEventListener("keydown", this.#handleKey);
  }
}
