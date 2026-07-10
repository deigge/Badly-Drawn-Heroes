export const SOUND = {
  ATTACK_LIGHT: new Audio("mp3/sounds/attack_light.mp3"),
  ATTACK_HEAVY: new Audio("mp3/sounds/attack_heavy.mp3"),
  HIT: new Audio("mp3/sounds/hit.mp3"),
  BLOCK: new Audio("mp3/sounds/block.mp3"),
  HEAL: new Audio("mp3/sounds/heal.mp3"),
  CONFIRM: new Audio("mp3/sounds/confirm.mp3"),
  CHANGE_SELECTION: new Audio("mp3/sounds/change_selection.mp3"),
  TICKING: new Audio("mp3/sounds/ticking.mp3"),
  LEVEL_PASSED: new Audio("mp3/sounds/level_passed.mp3"),
};

Object.values(SOUND).forEach((track) => {
  track.volume = 0.1;
});

export function playSound(sound) {
  if (!sound) {
    console.warn("playSound: kein gültiges Sound-Objekt übergeben");
    return;
  }

  sound.currentTime = 0;

  sound.play().catch((error) => {
    console.warn("Sound konnte nicht abgespielt werden:", error);
  });
}
