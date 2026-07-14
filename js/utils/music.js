/** Background music tracks for each level type plus victory/game-over stings. */
export const MUSIC = {
  NORMAL: new Audio("mp3/music/normal_background.mp3"),
  BOSS: new Audio("mp3/music/boss_background.mp3"),
  RECOVERY: new Audio("mp3/music/recovery_background.mp3"),
  VICTORY: new Audio("mp3/music/victory.mp3"),
  GAME_OVER: new Audio("mp3/music/game_over.mp3"),
};

Object.values(MUSIC).forEach((track) => {
  track.loop = true;
  track.volume = 0.15;
});

/** The currently playing track, if any. */
let currentTrack = null;

/**
 * Plays the given track, stopping and resetting whatever was playing
 * before. No-op if the requested track is already playing.
 *
 * @param {HTMLAudioElement} track - One of the tracks from `MUSIC`.
 * @returns {void}
 */
export function playMusic(track) {
  if (currentTrack === track) return;

  stopMusic();

  currentTrack = track;
  currentTrack.currentTime = 0;
  currentTrack.play().catch((error) => {
    console.warn("Failed to play music:", error);
  });
}

/**
 * Stops and resets the currently playing track, if any.
 *
 * @returns {void}
 */
export function stopMusic() {
  if (!currentTrack) return;
  currentTrack.pause();
  currentTrack.currentTime = 0;
  currentTrack = null;
}
