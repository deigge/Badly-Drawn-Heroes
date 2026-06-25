import { AttackCanvas } from "./attackCanvas.js";
import { LevelSelection } from "./levelSelection.js";
import { GameLoop } from "./core/gameLoop.js";

let currentScene;

function init() {
  const attackCanvas = new AttackCanvas("playerAttackArea");

  const canvas = document.getElementById("playArea");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  currentScene = new LevelSelection(ctx);

  const game = new GameLoop(currentScene, ctx);
  game.start();
}

document.addEventListener("DOMContentLoaded", init);
