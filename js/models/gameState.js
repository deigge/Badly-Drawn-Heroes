class GameStateClass {
  #currentMap = null;
  #playerHealth = 100;

  get playerHealth() {
    return this.#playerHealth;
  }

  reset() {
    this.#playerHealth = 100;
  }

  setMap(map) {
    this.#currentMap = map;
  }

  getMap() {
    return this.#currentMap;
  }

  getNextLevel() {}
}

export const GameState = new GameStateClass();
