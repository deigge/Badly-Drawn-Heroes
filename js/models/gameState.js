class GameStateClass {
  #currentMap = null;
  #playerHealth = 100;

  get playerHealth() {
    return this.#playerHealth;
  }

  reset() {
    this.#playerHealth = 100;
  }

  set map(map) {
    this.#currentMap = map;
  }

  get map() {
    return this.#currentMap;
  }
}

export const GameState = new GameStateClass();
