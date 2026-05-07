// create canvas element and append it to document body
var canvas = document.getElementById('drawCanvas');

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');

// last known position
var pos = { x: 0, y: 0 };

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

const img = new Image();
size = 200;
 
  // Handle image load
  img.onload = () => {
    ctx.drawImage(img, (canvas.width/2)-(size/2), (canvas.height/2) - (size/2), size, size); // Draw SVG at (0,0)
  };
 
  // Handle errors (e.g., MIME type issues)
  img.onerror = (error) => {
    console.error('Failed to load SVG:', error);
  };
 
  // Load external SVG file
  img.src = 'img/sun.svg'; // Replace with your SVG path

// new position from mouse event
function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#c0392b';

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}

function createSVGMask(){
    const templateCtx = templateCanvas.getContext('2d');
    templateCtx.drawImage(img, x, y, w, h);

    const imgData = templateCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const mask = new Uint8Array(canvas.width * canvas.height);

    for (let i = 0; i < mask.length; i++) {
        // alpha > 30 bedeutet hier ist SVG-Inhalt
        if (imgData[i * 4 + 3] > 30) {
            mask[i] = 1;
        }
    }
}

// ---- EA1 ----
// create canvas element and append it to document body
var ea1canvas = document.getElementById('ea1Canvas');

// get canvas 2D context and set him correct size
var ea1ctx = ea1canvas.getContext('2d');

ea1ctx.font = "40px Arial";

for(let i = 1; i <= 10; i++){
  const alpha = 1 - i * 0.1;
  ea1ctx.fillStyle = `rgba(17, 71, 20, ${alpha})`;
  ea1ctx.fillText("Hello Canvas",10,i*30);
}

  ea1ctx.fillStyle = '#000000';
  ea1ctx.fillText("Hello Canvas",10,350);

ea1ctx.beginPath();
ea1ctx.moveTo(15, 355);
ea1ctx.quadraticCurveTo(130, 370, 240, 355);
ea1ctx.stroke();