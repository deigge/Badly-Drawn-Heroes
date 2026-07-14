import { LEVEL_TYPES } from "../models/gameLevel.js";
import { spriteSheetLoader, SpriteType } from "../utils/spritesheetLoader.js";
import { createPlayer } from "../models/player.js";

const CRITICAL_IMAGES = [
  ...Object.values(LEVEL_TYPES).map((type) => `./img/level/${type}_level.png`),
  "./img/ui/finish_screen_a.png",
  "./img/ui/finish_screen_b.png",
  "./img/ui/dead_screen_a.png",
  "./img/ui/dead_screen_b.png",
  "./img/ui/frame.png",
  "./img/ui/legend.png",
];

const CRITICAL_SPRITESHEETS = Object.values(SpriteType);

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

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
