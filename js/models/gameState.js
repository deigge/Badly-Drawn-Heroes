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
}

export const GameState = new GameStateClass();
