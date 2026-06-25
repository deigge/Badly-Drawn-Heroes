export const GameState = {
  currentMap: [],
  currentLevel: 0,
  playerHealth: 100,

  reset() {
    this.currentLevel = 0;
    this.playerHealth = 100;
  },

  nextLevel() {
    this.currentLevel++;
  },

  setMap(map) {
    this.currentMap = map;
  },

  getMap() {
    return this.currentMap;
  },
};
