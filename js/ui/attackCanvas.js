export class AttackCanvas {
  #picCanvas;
  #drawCanvas;
  #picCtx;
  #drawCtx;
  #pos = { x: 0, y: 0 };

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

  #loadImage(src) {
    const img = new Image();
    const size = this.#picCanvas.width;
    const svgSize = size * 0.8;
    const offset = (size - svgSize) / 2;

    img.onload = () =>
      this.#picCtx.drawImage(img, offset, offset, svgSize, svgSize);
    img.onerror = (err) =>
      console.error("AttackCanvas: Failed to load image:", err);
    img.src = src;
  }

  drawSprite(spriteCanvas) {
    const size = this.#picCanvas.width;
    const targetSize = size * 0.8;
    const offset = (size - targetSize) / 2;
    this.#picCtx.clearRect(0, 0, size, size);
    this.#picCtx.drawImage(
      spriteCanvas,
      offset,
      offset,
      targetSize,
      targetSize,
    );
  }

  #registerEvents() {
    this.#drawCanvas.addEventListener("mousedown", this.#setPosition);
    this.#drawCanvas.addEventListener("mousemove", this.#draw);
    this.#drawCanvas.addEventListener("mouseenter", this.#setPosition);
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
    this.#pos = this.#getMousePos(e);
  };

  #draw = (e) => {
    if (e.buttons !== 1) return;
    const newPos = this.#getMousePos(e);
    this.#drawCtx.beginPath();
    this.#drawCtx.lineWidth = 8;
    this.#drawCtx.lineCap = "round";
    this.#drawCtx.strokeStyle = "#c0392b";
    this.#drawCtx.moveTo(this.#pos.x, this.#pos.y);
    this.#drawCtx.lineTo(newPos.x, newPos.y);
    this.#drawCtx.stroke();
    this.#pos = newPos;
  };

  clearDrawing() {
    this.#drawCtx.clearRect(
      0,
      0,
      this.#drawCanvas.width,
      this.#drawCanvas.height,
    );
  }
}
