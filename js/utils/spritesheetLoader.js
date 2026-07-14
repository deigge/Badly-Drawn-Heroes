/** Identifiers for each character/asset type that has a spritesheet. */
export const SpriteType = {
  PLAYER: "player",
  NORMAL_ENEMY: "normalEnemy",
  BOSS_ENEMY: "bossEnemy",
  ATTACKS: "attacks",
};

/** Maps each `SpriteType` to its image and frame-data (JSON) file paths. */
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

/**
 * A loaded spritesheet: the underlying image plus its frames, grouped by
 * animation name (e.g. "playerIdle", "enemyAttack").
 */
class SpriteSheet {
  /**
   * @param {HTMLImageElement} image - The full spritesheet image.
   * @param {Record<string, object[]>} groups - Frames grouped by animation name.
   */
  constructor(image, groups) {
    this.image = image;
    this.groups = groups;
  }

  /**
   * @param {string} groupName - Animation/frame-group name.
   * @returns {object} A random frame from the group.
   * @throws {Error} If the group doesn't exist or is empty.
   */
  getRandomFrame(groupName) {
    const frames = this.groups[groupName];
    if (!frames || frames.length === 0) {
      throw new Error(`No frames found for group "${groupName}"`);
    }
    const index = Math.floor(Math.random() * frames.length);
    return frames[index];
  }

  /**
   * @param {string} groupName - Animation/frame-group name.
   * @param {number} index - Frame index within the group.
   * @returns {object} The frame at the given index.
   */
  getFrame(groupName, index) {
    return this.groups[groupName][index];
  }
}

/**
 * Loads and caches spritesheets by character/asset type, so each
 * spritesheet is only fetched and decoded once no matter how many times
 * `load()` is called (e.g. once during asset preloading, then again when
 * an `Entity` is created).
 */
class SpriteSheetLoader {
  #cache = new Map();

  /**
   * Loads a spritesheet, returning the cached instance if it was already loaded.
   *
   * @param {string} character - One of `SpriteType`.
   * @returns {Promise<SpriteSheet>} The loaded (or cached) spritesheet.
   * @throws {Error} If the frame-data JSON fails to load.
   */
  async load(character) {
    if (this.#cache.has(character)) {
      return this.#cache.get(character);
    }

    const entry = REGISTRY[character];
    const json = await fetch(entry.json).then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${entry.json}`);
      return r.json();
    });
    const image = await this.#loadImage(entry.sheet);
    const sheet = new SpriteSheet(image, this.#groupFrames(json));

    this.#cache.set(character, sheet);
    return sheet;
  }

  /**
   * Groups raw frame data by animation name, derived from each frame's
   * name with any trailing digits stripped (e.g. "playerIdle3" -> "playerIdle").
   *
   * @param {{name: string}[]} frames - Raw frame list from the spritesheet JSON.
   * @returns {Record<string, object[]>} Frames grouped by animation name.
   */
  #groupFrames(frames) {
    const groups = {};
    for (const frame of frames) {
      const key = frame.name.replace(/\d+$/, "");
      if (!groups[key]) groups[key] = [];
      groups[key].push(frame);
    }
    return groups;
  }

  /**
   * @param {string} src - Path/URL of the spritesheet image.
   * @returns {Promise<HTMLImageElement>} Resolves with the loaded image element.
   */
  #loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

/** Shared spritesheet loader instance, used by all entities and the asset preloader. */
export const spriteSheetLoader = new SpriteSheetLoader();
