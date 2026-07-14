/**
 * Crops a single frame out of a spritesheet image and renders it onto its
 * own canvas, sized exactly to the frame.
 *
 * @param {HTMLImageElement} image - The full spritesheet image.
 * @param {{x: number, y: number, width: number, height: number}} frame - Frame bounds within the spritesheet.
 * @returns {HTMLCanvasElement} Canvas containing just the cropped frame.
 */
export function frameToCanvas(image, frame) {
  const canvas = document.createElement("canvas");
  canvas.width = frame.width;
  canvas.height = frame.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    frame.x,
    frame.y,
    frame.width,
    frame.height,
    0,
    0,
    frame.width,
    frame.height,
  );
  return canvas;
}
