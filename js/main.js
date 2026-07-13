import { AttackCanvas } from "./ui/attackCanvas.js";
import { LevelSelection } from "./scenes/levelSelectionScene.js";
import { GameLoop } from "./core/gameLoop.js";
import { GameScene } from "./scenes/gameScene.js";
import { SceneSwitcher } from "./core/sceneSwitcher.js";
import { FinishedScene } from "./scenes/finishedScene.js";
import { DeadScene } from "./scenes/deadScene.js";
import { GameState } from "./models/gameState.js";

async function init() {
  const attackCanvas = new AttackCanvas("playerAttackArea");
  const canvas = document.getElementById("playArea");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  GameState.highscore = Number(localStorage.getItem("highscore")) || 0;
  document.getElementById("highscore").textContent = GameState.highscore;

  const switcher = new SceneSwitcher();
  const levelSelection = await LevelSelection.create(ctx, switcher);
  const gameloop = new GameLoop(levelSelection, ctx);

  switcher.onSceneComplete(async function (nextScene) {
    if (nextScene === "game")
      gameloop.setScene(new GameScene(ctx, switcher, attackCanvas));
    if (nextScene === "finished")
      gameloop.setScene(new FinishedScene(ctx, switcher));
    if (nextScene === "dead") gameloop.setScene(new DeadScene(ctx, switcher));
    if (nextScene === "levelSelection")
      gameloop.setScene(await LevelSelection.create(ctx, switcher));
  });

  gameloop.start();
}

init();
