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
import { LEVEL_TYPES } from "../models/gameLevel.js";
import { playSound, SOUND } from "../utils/sound.js";
import { playMusic } from "../utils/music.js";

export class GameScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;
  #background = new Image();
  #attackCanvas;
  #attacks;
  #attackTimer = new Timer(6);
  #currentScoreElement;
  #buttonListeners = [];

  constructor(ctx, switcher, attackCanvas) {
    super();
    this.#ctx = ctx;
    this.#switcher = switcher;
    this.#attackCanvas = attackCanvas;

    this.#mapCanvas = drawMap(GameState.map, 0);
    this.#changeLevelEnv();

    if (GameState.map.currentLevel.type == LEVEL_TYPES.RECOVERY) {
      document.getElementById("recoveryButton").hidden = false;
    }

    this.#attacks = new Attacks();
    this.#attacks.init();

    this.#currentScoreElement = document.getElementById("currentScore");

    this.#setButtonEvents();

    this.#enableButtons();

    document.addEventListener("keydown", this.#handleKey);
  }

  #handleKey = (e) => {
    if (e.key === "Enter") {
      this.#nextLevel();
      return;
    } else if (e.key === "1") {
      document.getElementById("recoveryButton").hidden = true;
      this.#switcher.notify("dead");
      return;
    } else if (e.key === "2") {
      document.getElementById("recoveryButton").hidden = true;
      this.#switcher.notify("finished");
      return;
    }
  };

  #changeLevelEnv() {
    this.#background.src = GameState.map.currentLevel.backgroundImage;
    playMusic(GameState.map.currentLevel.backgroundMusicType);
  }

  update(delta) {
    if (player.isDead) {
      this.#disableButtons();
      this.#switcher.notify("dead");
    }

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
      Colors.healthbar.player,
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
        Colors.healthbar.enemy,
      );

      const healthbarX =
        enemyX + (enemyCanvas.width - healthbarCanvas.width) / 2;

      this.#ctx.drawImage(
        healthbarCanvas,
        healthbarX,
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

  #loadAction(isHeavy, onResolve) {
    const attackIcon = isHeavy
      ? this.#attacks.getRandomHeavyAttack()
      : this.#attacks.getRandomLightAttack();

    this.#disableButtons();
    this.#attackCanvas.drawSprite(attackIcon);
    this.#attackCanvas.enableDrawing();

    let timer = document.getElementById("drawTimer");
    timer.style.visibility = "visible";

    playSound(SOUND.TICKING);

    player.renderer.playAnimation("playerAttack");

    this.#attackTimer.start(
      (remaining) => {
        timer.textContent = remaining;
      },
      () => {
        player.renderer.playAnimation("playerIdle");
        timer.style.visibility = "hidden";

        const { picCanvas, drawCanvas } = this.#attackCanvas.getBothCanvas();
        const damageTier = scoreAttack(picCanvas, drawCanvas);

        GameState.addToScore(pointsForAttack(damageTier, !isHeavy));
        this.#updateScore();

        this.#attackCanvas.clear();
        this.#attackCanvas.drawScore(damageTier);

        onResolve(damageTier);

        this.#attackCanvas.disableDrawing();
        this.#disableButtons();
        this.#enemyAttack(GameState.map.currentLevel.enemies);
      },
    );
  }

  #lightAttack() {
    this.#loadAction(false, (tier) => {
      this.#applyAttackDamage(tier);
      playSound(SOUND.ATTACK_LIGHT);
    });
  }

  #heavyAttack() {
    this.#loadAction(true, (tier) => {
      this.#applyAttackDamage(tier * 4);
      playSound(SOUND.ATTACK_HEAVY);
    });
  }

  #block() {
    this.#loadAction(false, (tier) => {
      player.damageTakenMultiplier = 1 - tier;
      playSound(SOUND.BLOCK);
    });
  }

  #heal() {
    this.#loadAction(true, (tier) => {
      player.heal(Math.round(player.attackPower * tier));
      playSound(SOUND.HEAL);
    });
  }

  #healRecoveryZone() {
    document.getElementById("recoveryButton").hidden = true;
    playSound(SOUND.HEAL);
    player.heal(30);
    this.#nextLevel();
  }

  #applyAttackDamage(tier) {
    const enemies = GameState.map.currentLevel.enemies;
    const target = enemies[0];
    if (!target) return;

    player.dealDamageTo(target, tier);
    if (target.isDead) {
      enemies.shift();
      if (enemies.length === 0) {
        this.#nextLevel();
      }
    }
  }

  #enemyAttack(enemies, index = 0) {
    if (index >= enemies.length) {
      this.#enableButtons();
      player.resetDamageTakenMultiplier();
      return;
    }
    const enemy = enemies[index];
    enemy.renderer.playFinite(
      "enemyAttack",
      () => {
        playSound(SOUND.HIT);
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
      playSound(SOUND.LEVEL_PASSED);

      this.#mapCanvas = drawMap(GameState.map, GameState.map.currentLevelIndex);
      this.#changeLevelEnv();

      if (nextLevel.type == LEVEL_TYPES.RECOVERY) {
        this.#disableButtons();
        document.getElementById("recoveryButton").hidden = false;
      } else {
        this.#enableButtons();
        document.getElementById("recoveryButton").hidden = true;
      }
    } else {
      this.#disableButtons();
      this.#switcher.notify("finished");
    }
  }

  #setButtonEvents() {
    const buttonIds = [
      "lightAttack",
      "heavyAttack",
      "block",
      "heal",
      "recoveryButton",
    ];
    const handlers = {
      lightAttack: () => this.#lightAttack(),
      heavyAttack: () => this.#heavyAttack(),
      block: () => this.#block(),
      heal: () => this.#heal(),
      recoveryButton: () => this.#healRecoveryZone(),
    };

    buttonIds.forEach((id) => {
      const listener = () => {
        playSound(SOUND.CONFIRM);
        handlers[id]();
      };

      document.getElementById(id).addEventListener("click", listener);

      this.#buttonListeners.push({ id, listener });
    });
  }

  #removeButtonEvents() {
    this.#buttonListeners.forEach(({ id, listener }) => {
      document.getElementById(id).removeEventListener("click", listener);
    });
    this.#buttonListeners = [];
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
    this.#removeButtonEvents();
  }
}
