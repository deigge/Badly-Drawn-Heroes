import { player } from "./player.js";

/**
 * Central, singleton game state: the current map, running score, and
 * persisted high score. Exported as a single shared instance (`GameState`)
 * so any scene can read/update it without passing it through constructors.
 */
class GameStateClass {
  #currentMap = null;
  #score = 0;
  #highscore = 0;

  set map(map) {
    this.#currentMap = map;
  }

  get map() {
    return this.#currentMap;
  }

  get score() {
    return this.#score;
  }

  get highscore() {
    return this.#highscore;
  }

  set highscore(score) {
    this.#highscore = score;
  }

  /**
   * Adds points to the current run's score.
   *
   * @param {number} points - Points to add.
   * @returns {void}
   */
  addToScore(points) {
    this.#score += points;
  }

  /**
   * Resets state for a new run: clears the map and score, fully heals the
   * player, and resets the on-screen score display.
   *
   * @returns {void}
   */
  reset() {
    this.#currentMap = null;
    this.#score = 0;
    player.heal(1000);

    document.getElementById("currentScore").textContent = "0";
  }
}

export const GameState = new GameStateClass();
