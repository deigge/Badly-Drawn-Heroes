export class AttackCanvas {
  static #SIZE = 200;

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

    this.#setSize(AttackCanvas.#SIZE);
    this.#loadImage("img/sun.svg");
    this.#registerEvents();
  }

  // ===== SETUP =====

  #setSize(size) {
    this.#picCanvas.width = size;
    this.#picCanvas.height = size;
    this.#drawCanvas.width = size;
    this.#drawCanvas.height = size;
  }

  #loadImage(src) {
    const img = new Image();
    const svgSize = AttackCanvas.#SIZE * 0.8;
    const offset = (AttackCanvas.#SIZE - svgSize) / 2;

    img.onload = () =>
      this.#picCtx.drawImage(img, offset, offset, svgSize, svgSize);
    img.onerror = (err) =>
      console.error("AttackCanvas: Failed to load image:", err);
    img.src = src;
  }

  #registerEvents() {
    this.#drawCanvas.addEventListener("mousedown", this.#setPosition);
    this.#drawCanvas.addEventListener("mousemove", this.#draw);
    this.#drawCanvas.addEventListener("mouseenter", this.#setPosition);
  }

  // ===== DRAWING =====

  #getMousePos(e) {
    const rect = this.#drawCanvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
