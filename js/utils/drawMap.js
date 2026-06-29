import { Colors } from "./colors.js";

export const NODE_RADIUS = 6;

export function drawMap(map, selectedLevelIndex = null) {
  const xSpacing = 80;
  const nodeRadius = NODE_RADIUS;
  const levelBorderWidth = 2;
  const levelCount = map.getLevelCount();

  const width =
    (levelCount - 1) * xSpacing + (nodeRadius + levelBorderWidth) * 2;
  const height = (nodeRadius + levelBorderWidth) * 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  let x = nodeRadius + levelBorderWidth;
  const centerY = canvas.height / 2;

  for (let i = 0; i < levelCount; i++) {
    if (!(i == levelCount - 1)) {
      ctx.beginPath();
      ctx.moveTo(x, centerY);
      ctx.lineTo(x + xSpacing, centerY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = Colors.level.ui.connection;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, centerY, nodeRadius, 0, Math.PI * 2);

    ctx.fillStyle = Colors.level[map.getLevel(i).getType()];

    ctx.fill();

    ctx.lineWidth = levelBorderWidth;
    ctx.strokeStyle = Colors.level.ui.border;
    if (selectedLevelIndex === i) {
      ctx.lineWidth = levelBorderWidth * 2;
      ctx.strokeStyle = Colors.level.ui.selected;
    }
    ctx.stroke();
    ctx.lineWidth = 2;
    x += xSpacing;
  }

  return canvas;
}
