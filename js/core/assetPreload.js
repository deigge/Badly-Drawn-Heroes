import { LEVEL_TYPES } from "../models/gameLevel.js";
import { spriteSheetLoader, SpriteType } from "../utils/spritesheetLoader.js";
import { createPlayer } from "../models/player.js";

/** Static images required before the game can start (level backgrounds, UI screens). */
const CRITICAL_IMAGES = [
  ...Object.values(LEVEL_TYPES).map((type) => `./img/level/${type}_level.png`),
  "./img/ui/finish_screen_a.png",
  "./img/ui/finish_screen_b.png",
  "./img/ui/dead_screen_a.png",
  "./img/ui/dead_screen_b.png",
  "./img/ui/frame.png",
  "./img/ui/legend.png",
];

/** All spritesheet types (player, enemies, attacks) required before the game can start. */
const CRITICAL_SPRITESHEETS = Object.values(SpriteType);

/**
 * Loads all critical assets (images, spritesheets, player) required before
 * the game can start. Reports progress via `onProgress` and throws if any
 * asset fails to load, so the caller can display an error state instead of
 * starting the game with missing assets.
 *
 * @param {(loaded: number, total: number) => void} [onProgress] - Called after each asset finishes loading (success or failure).
 * @returns {Promise<void>} Resolves once all assets have loaded successfully.
 * @throws {Error} If one or more assets failed to load.
 */
export async function preloadAssets(onProgress) {
  const total = CRITICAL_IMAGES.length + CRITICAL_SPRITESHEETS.length + 1;
  let loaded = 0;
  const tick = () => onProgress?.(++loaded, total);

  const imagePromises = CRITICAL_IMAGES.map((src) =>
    loadImage(src).finally(tick),
  );

  const spritePromises = CRITICAL_SPRITESHEETS.map((type) =>
    spriteSheetLoader.load(type).finally(tick),
  );

  const playerPromise = createPlayer().finally(tick);

  const results = await Promise.allSettled([
    ...imagePromises,
    ...spritePromises,
    playerPromise,
  ]);
  const failed = results.filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    throw new Error(`${failed.length} asset(s) failed to load.`);
  }
}

/**
 * Loads a single image and resolves once it is fully loaded.
 *
 * @param {string} src - Path/URL of the image to load.
 * @returns {Promise<HTMLImageElement>} Resolves with the loaded image element.
 * @throws {Error} If the image fails to load (e.g. missing file, network error).
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
