export const Character = {
  PLAYER: "player",
  NORMAL_ENEMY: "normalEnemy",
};

const REGISTRY = {
  player: {
    sheet: "./img/player/player_spritesheet.png",
    json: "./img/player/player_spritesheet.json",
  },
  normalEnemy: {
    sheet: "./assets/enemies/slime.png",
    json: "./assets/enemies/slime.json",
  },
};

export class SpriteSheetLoader {
  async load(character) {
    const entry = REGISTRY[character];
    const json = await fetch(entry.json).then((r) => r.json());
    const image = await this.#loadImage(entry.sheet);

    return {
      image,
      animations: this.#groupFrames(json),
    };
  }

  #groupFrames(frames) {
    const groups = {};
    for (const frame of frames) {
      const key = frame.name.replace(/\d+$/, "");
      if (!groups[key]) groups[key] = [];
      groups[key].push(frame);
    }
    return groups;
  }

  #loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}
