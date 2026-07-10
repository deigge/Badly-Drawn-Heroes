export const SpriteType = {
  PLAYER: "player",
  NORMAL_ENEMY: "normalEnemy",
  BOSS_ENEMY: "bossEnemy",
  ATTACKS: "attacks",
};

const REGISTRY = {
  player: {
    sheet: "./img/player/player_spritesheet.png",
    json: "./img/player/player_spritesheet.json",
  },
  normalEnemy: {
    sheet: "./img/normal_enemy/normal_enemy_spritesheet.png",
    json: "./img/normal_enemy/normal_enemy_spritesheet.json",
  },
  bossEnemy: {
    sheet: "./img/boss_enemy/boss_spritesheet.png",
    json: "./img/boss_enemy/boss_spritesheet.json",
  },
  attacks: {
    sheet: "./img/attacks/attack_spritesheet.png",
    json: "./img/attacks/attack_spritesheet.json",
  },
};

class SpriteSheet {
  constructor(image, groups) {
    this.image = image;
    this.groups = groups;
  }

  getRandomFrame(groupName) {
    const frames = this.groups[groupName];
    if (!frames || frames.length === 0) {
      throw new Error(`No frames found for group "${groupName}"`);
    }
    const index = Math.floor(Math.random() * frames.length);
    return frames[index];
  }

  getFrame(groupName, index) {
    return this.groups[groupName][index];
  }
}

export class SpriteSheetLoader {
  async load(character) {
    const entry = REGISTRY[character];
    const json = await fetch(entry.json).then((r) => r.json());
    const image = await this.#loadImage(entry.sheet);
    return new SpriteSheet(image, this.#groupFrames(json));
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
