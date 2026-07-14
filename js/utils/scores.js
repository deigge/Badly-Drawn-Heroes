import { GameState } from "../models/gameState.js";

const currentScoreElement = document.getElementById("currentScore");
const highscoreElement = document.getElementById("highscore");

/**
 * Adds points to the current run's score and updates the on-screen display.
 *
 * @param {number} addedpoints - Points to add to the current score.
 * @returns {void}
 */
export function updateCurrentScore(addedpoints) {
  GameState.addToScore(addedpoints);
  currentScoreElement.textContent = GameState.score;
}

/**
 * Compares the current run's score against the saved high score and, if
 * higher, updates `GameState`, the on-screen display, and persists the new
 * high score to `localStorage`.
 *
 * @returns {void}
 */
export function updateHighscore() {
  if (GameState.score > GameState.highscore) {
    GameState.highscore = GameState.score;
    highscoreElement.textContent = GameState.highscore;
    localStorage.setItem("highscore", GameState.highscore);
  }
}
