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
import { updateCurrentScore } from "../utils/scores.js";

/**
 * The main combat scene: renders the player, current enemies, and map
 * progress, and drives the drawing-based combat actions (light/heavy
 * attack, block, heal) as well as level/map progression.
 */
export class GameScene extends Scene {
  #mapCanvas;
  #switcher;
  #ctx;
  #background = new Image();
  #attackCanvas;
  #attacks;
  #attackTimer = new Timer(6);
  #buttonListeners = [];

  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context to render into.
   * @param {import("../core/sceneSwitcher.js").SceneSwitcher} switcher - Used to notify when the scene ends (dead/finished).
   * @param {import("../ui/attackCanvas.js").AttackCanvas} attackCanvas - Canvas used for the drawing minigame.
   */
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

    this.#setButtonEvents();

    this.#enableButtons();

    document.addEventListener("keydown", this.#handleKey);
  }

  /**
   * Debug/dev shortcut keys: Enter skips to the next level, "1"/"2" force
   * the dead/finished scene directly.
   *
   * @param {KeyboardEvent} e
   * @returns {void}
   */
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

  /**
   * Updates the background image and music to match the current level.
   *
   * @returns {void}
   */
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

  /**
   * Shared flow for every drawing-based combat action: shows a random
   * attack template on the draw canvas, disables buttons while the player
   * draws, and once the timer runs out, scores the drawing, awards points
   * (only relevant for attacks), invokes `onResolve` with the resulting
   * damage tier so the caller can apply its specific effect, then lets
   * enemies retaliate.
   *
   * @param {boolean} isHeavy - Whether to use the heavy-attack template/scoring.
   * @param {(tier: number) => void} onResolve - Called with the resulting damage tier (0–1) once drawing time is up.
   * @returns {void}
   */
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

        updateCurrentScore(pointsForAttack(damageTier, !isHeavy));

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
    // Heavy attacks deal 4x the base damage of the tier, on top of the
    // stronger heavy-attack template used in #loadAction.
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

  /**
   * Handles the recovery-level heal button: heals a flat amount and
   * immediately advances to the next level (no drawing minigame).
   *
   * @returns {void}
   */
  #healRecoveryZone() {
    document.getElementById("recoveryButton").hidden = true;
    playSound(SOUND.HEAL);
    player.heal(30);
    this.#nextLevel();
  }

  /**
   * Applies attack damage to the first (frontmost) enemy, removes it if
   * defeated, and advances to the next level once all enemies are dead.
   *
   * @param {number} tier - Damage multiplier from the drawing accuracy tier.
   * @returns {void}
   */
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

  /**
   * Lets enemies attack the player one after another. Recurses through the
   * enemy list so each enemy's attack animation finishes before the next
   * one starts; re-enables buttons and resets the block multiplier once
   * every enemy has attacked.
   *
   * @param {import("../models/entity.js").Entity[]} enemies - Enemies that get to attack.
   * @param {number} [index=0] - Index of the enemy currently attacking.
   * @returns {void}
   */
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
        this.#enemyAttack(enemies, index + 1); // attack with the next enemy once this one's animation finishes
      },
      2,
    );
  }

  /**
   * Awards level-completion points and advances `GameState.map` to the
   * next level, updating background/music/UI accordingly. If there is no
   * next level, the map is complete and the scene switches to "finished".
   *
   * @returns {void}
   */
  #nextLevel() {
    updateCurrentScore(
      pointsForLevelCompletion(GameState.map.currentLevel.type),
    );
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

  /**
   * Wires up click listeners for all combat/recovery buttons, tracking
   * them so they can be cleanly removed again in `#removeButtonEvents`.
   *
   * @returns {void}
   */
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

  /**
   * Removes all listeners registered by `#setButtonEvents`.
   *
   * @returns {void}
   */
  #removeButtonEvents() {
    this.#buttonListeners.forEach(({ id, listener }) => {
      document.getElementById(id).removeEventListener("click", listener);
    });
    this.#buttonListeners = [];
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
