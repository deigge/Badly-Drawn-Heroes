import { Colors } from "./colors.js";

export function drawHealthbar(current, max, color = Colors.healthbar.player) {
  const width = 120;
  const height = 20;
  const borderWidth = 2;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const ratio = Math.max(0, Math.min(1, current / max));
  const innerWidth = width - borderWidth * 2;
  const innerHeight = height - borderWidth * 2;

  // Hintergrund (verlorenes Leben)
  ctx.fillStyle = Colors.healthbar.background;
  ctx.fillRect(borderWidth, borderWidth, innerWidth, innerHeight);

  // Vordergrund (aktuelles Leben)
  ctx.fillStyle = color;
  ctx.fillRect(borderWidth, borderWidth, innerWidth * ratio, innerHeight);

  // Border
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = Colors.healthbar.border;
  ctx.strokeRect(
    borderWidth / 2,
    borderWidth / 2,
    width - borderWidth,
    height - borderWidth,
  );

  return canvas;
}
