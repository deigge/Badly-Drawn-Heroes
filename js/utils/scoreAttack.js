const threshold = 10;

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

function extractAlpha(imageData) {
  const { data } = imageData;
  const alpha = new Uint8Array(data.length / 4);
  for (let i = 0; i < alpha.length; i++) {
    alpha[i] = data[i * 4 + 3];
  }
  return alpha;
}

function fScore(precision, hitrate) {
  if (precision + hitrate === 0) return 0;
  return (2 * precision * hitrate) / (precision + hitrate);
}

function getDamageTier(score) {
  if (score >= 0.6) return 1.0;
  if (score >= 0.4) return 0.75;
  if (score >= 0.2) return 0.5;
  if (score > 0) return 0.25;
  return 0;
}
