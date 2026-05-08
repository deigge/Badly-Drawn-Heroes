// ===== CANVAS SETUP =====
const picCanvas = document.getElementById('picCanvas');
const drawCanvas = document.getElementById('drawCanvas');

const picCtx = picCanvas.getContext('2d');
const ctx = drawCanvas.getContext('2d');

// Optional: gemeinsame Größe (wichtig für sauberes Stacken)
const WIDTH = 400;
const HEIGHT = 400;

picCanvas.width = WIDTH;
picCanvas.height = HEIGHT;

drawCanvas.width = WIDTH;
drawCanvas.height = HEIGHT;

// ===== MOUSE STATE =====
let pos = { x: 0, y: 0 };

// ===== IMAGE (optional, bleibt wie bei dir) =====
const img = new Image();
const size = 200;

img.onload = () => {
  picCtx.drawImage(
    img,
    (WIDTH / 2) - (size / 2),
    (HEIGHT / 2) - (size / 2),
    size,
    size
  );
};

img.onerror = (err) => {
  console.error('Failed to load image:', err);
};

img.src = 'img/sun.svg';

// ===== MOUSE COORDINATE FIX =====
function getMousePos(e) {
  const rect = drawCanvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ===== INPUT HANDLING =====
function setPosition(e) {
  pos = getMousePos(e);
}

// ===== DRAW FUNCTION =====
function draw(e) {
  // nur wenn linke Maustaste gedrückt
  if (e.buttons !== 1) return;

  const newPos = getMousePos(e);

  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#c0392b';

  ctx.moveTo(pos.x, pos.y);
  ctx.lineTo(newPos.x, newPos.y);
  ctx.stroke();

  pos = newPos;
}

// ===== EVENTS =====
drawCanvas.addEventListener('mousedown', setPosition);
drawCanvas.addEventListener('mousemove', draw);
drawCanvas.addEventListener('mouseenter', setPosition);