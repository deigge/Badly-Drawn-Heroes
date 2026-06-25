export const LEVEL_TYPES = {
  NORMAL: "normal",
  BOSS: "boss",
  RECOVERY: "recovery",
};

export class GameLevel {
  #type;

  constructor(type) {
    if (!Object.values(LEVEL_TYPES).includes(type)) {
      throw new Error(`Invalid level type: ${type}`);
    }

    this.#type = type;
  }

  getType() {
    return this.#type;
  }
}
