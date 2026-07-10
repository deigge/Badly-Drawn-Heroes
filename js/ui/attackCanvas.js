export class AttackCanvas {
  #picCanvas;
  #drawCanvas;
  #picCtx;
  #drawCtx;
  #pos = { x: 0, y: 0 };
  #drawingEnabled = false;

  constructor(containerId) {
    const container = document.getElementById(containerId);

    this.#picCanvas = document.createElement("canvas");
    this.#drawCanvas = document.createElement("canvas");

    this.#picCanvas.id = "picCanvas";
    this.#drawCanvas.id = "drawCanvas";

    container.appendChild(this.#picCanvas);
    container.appendChild(this.#drawCanvas);

    this.#picCtx = this.#picCanvas.getContext("2d");
    this.#drawCtx = this.#drawCanvas.getContext("2d");

    this.#setSize();
    //this.loadImage("img/sun.svg");
    this.#registerEvents();
  }

  // ===== SETUP =====

  #setSize() {
    const container = this.#drawCanvas.parentElement;
    const cssSize = container.getBoundingClientRect().width;

    this.#picCanvas.width = cssSize;
    this.#picCanvas.height = cssSize;
    this.#drawCanvas.width = cssSize;
    this.#drawCanvas.height = cssSize;
  }

  drawSprite(spriteCanvas) {
    const size = this.#picCanvas.width;
    const maxSize = size * 0.8;

    const scale = Math.min(
      maxSize / spriteCanvas.width,
      maxSize / spriteCanvas.height,
    );
    const drawWidth = spriteCanvas.width * scale;
    const drawHeight = spriteCanvas.height * scale;

    const offsetX = (size - drawWidth) / 2;
    const offsetY = (size - drawHeight) / 2;

    this.#picCtx.clearRect(0, 0, size, size);
    this.#picCtx.drawImage(
      spriteCanvas,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );
  }

  #registerEvents() {
    this.#drawCanvas.addEventListener("mousedown", this.#setPosition);
    this.#drawCanvas.addEventListener("mousemove", this.#draw);
    this.#drawCanvas.addEventListener("mouseenter", this.#setPosition);
  }

  getBothCanvas() {
    return { picCanvas: this.#picCanvas, drawCanvas: this.#drawCanvas };
  }

  // ===== DRAWING =====

  #getMousePos(e) {
    const rect = this.#drawCanvas.getBoundingClientRect();
    const scaleX = this.#drawCanvas.width / rect.width;
    const scaleY = this.#drawCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  #setPosition = (e) => {
    if (!this.#drawingEnabled) return;
    this.#pos = this.#getMousePos(e);
  };

  #draw = (e) => {
    if (!this.#drawingEnabled) return;
    if (e.buttons !== 1) return;
    const newPos = this.#getMousePos(e);
    this.#drawCtx.beginPath();
    this.#drawCtx.lineWidth = 6;
    this.#drawCtx.lineCap = "round";
    this.#drawCtx.strokeStyle = "#c0392b";
    this.#drawCtx.moveTo(this.#pos.x, this.#pos.y);
    this.#drawCtx.lineTo(newPos.x, newPos.y);
    this.#drawCtx.stroke();
    this.#pos = newPos;
  };

  drawScore(letter) {
    const size = this.#picCanvas.width;
    const maxSize = size * 0.5;

    this.#picCtx.clearRect(0, 0, size, size);

    this.#picCtx.font = `${maxSize}px sans-serif`;
    const metrics = this.#picCtx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const scale = Math.min(maxSize / textWidth, maxSize / textHeight);
    const fontSize = maxSize * scale;

    this.#picCtx.font = `${fontSize}px sans-serif`;
    this.#picCtx.fillStyle = "#000000";
    this.#picCtx.textAlign = "center";
    this.#picCtx.textBaseline = "middle";
    this.#picCtx.fillText(letter, size / 2, size / 2);
  }

  clear() {
    this.#drawCtx.clearRect(
      0,
      0,
      this.#drawCanvas.width,
      this.#drawCanvas.height,
    );

    this.#picCtx.clearRect(0, 0, this.#picCanvas.width, this.#picCanvas.height);
  }

  disableDrawing() {
    this.#drawingEnabled = false;
    this.#drawCanvas.style.cursor = "not-allowed";
  }

  enableDrawing() {
    this.#drawingEnabled = true;
    this.#drawCanvas.style.cursor = "crosshair"; // oder was auch immer du normal nutzt
  }
}
