import { AttackCanvas } from "./attackCanvas.js";
import { LevelSelection } from "./scenes/levelSelectionScene.js";
import { GameLoop } from "./core/gameLoop.js";
import { GameScene } from "./scenes/gameScene.js";
import { SceneSwitcher } from "./core/sceneSwitcher.js";
import { FinishedScene } from "./scenes/finishedScene.js";
import { DeadScene } from "./scenes/deadScene.js";

function init() {
  const attackCanvas = new AttackCanvas("playerAttackArea");

  const canvas = document.getElementById("playArea");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const switcher = new SceneSwitcher();

  const gameloop = new GameLoop(new LevelSelection(ctx, switcher), ctx);

  switcher.onSceneComplete(function (nextScene) {
    if (nextScene === "game") gameloop.setScene(new GameScene(ctx, switcher));
    if (nextScene === "finished")
      gameloop.setScene(new FinishedScene(ctx, switcher));
    if (nextScene === "dead") gameloop.setScene(new DeadScene(ctx, switcher));
  });

  gameloop.start();
}

document.addEventListener("DOMContentLoaded", init);
