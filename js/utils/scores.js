import { GameState } from "../models/gameState.js";

const currentScoreElement = document.getElementById("currentScore");
const highscoreElement = document.getElementById("highscore");

export function updateCurrentScore(addedpoints) {
  GameState.addToScore(addedpoints);
  currentScoreElement.textContent = GameState.score;
}

export function updateHighscore() {
  if (GameState.score > GameState.highscore) {
    GameState.highscore = GameState.score;
    highscoreElement.textContent = GameState.highscore;
    localStorage.setItem("highscore", GameState.highscore);
  }
}
