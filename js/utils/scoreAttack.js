/** Alpha value (0–255) above which a pixel counts as "filled"/drawn. */
const threshold = 80;

/**
 * Scores a drawn attack by comparing the player's drawing against the
 * template image, pixel by pixel, and maps the result to a damage tier.
 *
 * Compares "hitrate" (how much of the template was covered) and
 * "precision" (how much of the drawing actually stayed within the
 * template) via their F-score, then buckets that into one of five tiers.
 *
 * @param {HTMLCanvasElement} picCanvas - Canvas containing the template to trace.
 * @param {HTMLCanvasElement} drawCanvas - Canvas containing the player's drawing.
 * @returns {number} Damage tier: 0, 0.25, 0.5, 0.75, or 1.0.
 */
export function scoreAttack(picCanvas, drawCanvas) {
  let intersection = 0;
  let picTotal = 0;
  let drawTotal = 0;

  const picCtx = picCanvas.getContext("2d");
  const drawCtx = drawCanvas.getContext("2d");

  const picAlpha = extractAlpha(
    picCtx.getImageData(0, 0, picCanvas.width, picCanvas.height),
  );
  const drawAlpha = extractAlpha(
    drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height),
  );

  for (let i = 0; i < picAlpha.length; i++) {
    const picFilled = picAlpha[i] > threshold;
    const drawFilled = drawAlpha[i] > threshold;

    if (picFilled && drawFilled) {
      intersection++;
    }

    if (picFilled) picTotal++;
    if (drawFilled) drawTotal++;
  }

  const hitrate = picTotal > 0 ? intersection / picTotal : 0;
  const precision = drawTotal > 0 ? intersection / drawTotal : 0;

  const score = fScore(precision, hitrate);

  return getDamageTier(score);
}

/**
 * Extracts just the alpha channel from image data, one byte per pixel.
 *
 * @param {ImageData} imageData
 * @returns {Uint8Array} Alpha value (0–255) for each pixel.
 */
function extractAlpha(imageData) {
  const { data } = imageData;
  const alpha = new Uint8Array(data.length / 4);
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = data[i * 4 + 3];
  }
  return alpha;
}

/**
 * Harmonic mean of precision and hitrate (F1 score), used as the overall
 * accuracy measure for a drawing.
 *
 * @param {number} precision - Fraction of the drawing that fell inside the template.
 * @param {number} hitrate - Fraction of the template that was covered by the drawing.
 * @returns {number} F1 score between 0 and 1.
 */
function fScore(precision, hitrate) {
  if (precision + hitrate === 0) return 0;
  return (2 * precision * hitrate) / (precision + hitrate);
}

/**
 * Buckets a raw accuracy score into one of the fixed damage tiers used
 * throughout combat (points, damage, healing, block strength).
 *
 * @param {number} score - Accuracy score between 0 and 1.
 * @returns {number} Damage tier: 0, 0.25, 0.5, 0.75, or 1.0.
 */
function getDamageTier(score) {
  if (score >= 0.7) return 1.0;
  if (score >= 0.5) return 0.75;
  if (score >= 0.3) return 0.5;
  if (score > 0.1) return 0.25;
  return 0;
}
