import { player } from "./player.js";

class GameStateClass {
  #currentMap = null;
  #score = 0;

  set map(map) {
    this.#currentMap = map;
  }

  get map() {
    return this.#currentMap;
  }

  get score() {
    return this.#score;
  }

  addToScore(points) {
    this.#score += points;
  }

  reset() {
    this.#currentMap = null;
    this.#score = 0;
    player.heal(1000);

    document.getElementById("currentScore").textContent = "0";
  }
}

export const GameState = new GameStateClass();
