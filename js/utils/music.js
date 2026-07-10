export const MUSIC = {
  NORMAL: new Audio("mp3/music/normal_background.mp3"),
  BOSS: new Audio("mp3/music/boss_background.mp3"),
  RECOVERY: new Audio("mp3/music/recovery_background.mp3"),
  VICTORY: new Audio("mp3/music/victory.mp3"),
  GAME_OVER: new Audio("mp3/music/game_over.mp3"),
};

Object.values(MUSIC).forEach((track) => {
  track.loop = true;
  track.volume = 0.1;
});

let currentTrack = null;

export function playMusic(track) {
  if (currentTrack === track) return;

  stopMusic();

  currentTrack = track;
  currentTrack.currentTime = 0;
  currentTrack.play().catch((error) => {
    console.warn("Musik konnte nicht abgespielt werden:", error);
  });
}

export function stopMusic() {
  if (!currentTrack) return;
  currentTrack.pause();
  currentTrack.currentTime = 0;
  currentTrack = null;
}
