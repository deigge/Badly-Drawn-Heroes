/**
 * Drives the drawing minigame used for combat actions: overlays a
 * template canvas (`picCanvas`) with a canvas the player draws on
 * (`drawCanvas`), and exposes both so their contents can be compared for
 * scoring (see `scoreAttack`).
 */
export class AttackCanvas {
  #picCanvas;
  #drawCanvas;
  #picCtx;
  #drawCtx;
  #pos = { x: 0, y: 0 };
  #drawingEnabled = false;

  /**
   * @param {string} containerId - ID of the container element the two canvases are appended to.
   */
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

  /**
   * Sizes both canvases to match their container's current width (square canvases).
   *
   * @returns {void}
   */
  #setSize() {
    const container = this.#drawCanvas.parentElement;
    const cssSize = container.getBoundingClientRect().width;

    this.#picCanvas.width = cssSize;
    this.#picCanvas.height = cssSize;
    this.#drawCanvas.width = cssSize;
    this.#drawCanvas.height = cssSize;
  }

  /**
   * Draws the given sprite as the drawing template, centered and scaled to
   * fit within 80% of the canvas while preserving aspect ratio.
   *
   * @param {HTMLCanvasElement} spriteCanvas - Canvas containing the attack icon to trace.
   * @returns {void}
   */
  drawSprite(spriteCanvas) {
    const size = this.#picCanvas.width;
    const maxSize = size * 0.8;

    // Scale down uniformly so the sprite fits within maxSize on both axes.
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

  /**
   * Registers mouse listeners driving the drawing interaction.
   *
   * @returns {void}
   */
  #registerEvents() {
    this.#drawCanvas.addEventListener("mousedown", this.#setPosition);
    this.#drawCanvas.addEventListener("mousemove", this.#draw);
    this.#drawCanvas.addEventListener("mouseenter", this.#setPosition);
  }

  /**
   * @returns {{picCanvas: HTMLCanvasElement, drawCanvas: HTMLCanvasElement}} Both canvases, for scoring.
   */
  getBothCanvas() {
    return { picCanvas: this.#picCanvas, drawCanvas: this.#drawCanvas };
  }

  /**
   * Converts a mouse event's page coordinates into canvas-internal pixel
   * coordinates, accounting for any CSS scaling of the canvas element.
   *
   * @param {MouseEvent} e
   * @returns {{x: number, y: number}}
   */
  #getMousePos(e) {
    const rect = this.#drawCanvas.getBoundingClientRect();
    const scaleX = this.#drawCanvas.width / rect.width;
    const scaleY = this.#drawCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  /**
   * Updates the last known cursor position without drawing (used on
   * mousedown/mouseenter so the next line segment starts from the right spot).
   *
   * @param {MouseEvent} e
   * @returns {void}
   */
  #setPosition = (e) => {
    if (!this.#drawingEnabled) return;
    this.#pos = this.#getMousePos(e);
  };

  /**
   * Draws a line segment from the last known position to the current mouse
   * position while the left mouse button is held down.
   *
   * @param {MouseEvent} e
   * @returns {void}
   */
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

  /**
   * Replaces the template canvas contents with a large centered letter/symbol
   * representing the result tier (e.g. after scoring a drawing).
   *
   * @param {string} letter - Text to display (e.g. a tier label).
   * @returns {void}
   */
  drawScore(letter) {
    const size = this.#picCanvas.width;
    const maxSize = size * 0.5;

    this.#picCtx.clearRect(0, 0, size, size);

    // First pass at maxSize to measure the text, then rescale the font so
    // the actual rendered text fits within maxSize on both axes.
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

  /**
   * Clears both the template and the drawing canvas.
   *
   * @returns {void}
   */
  clear() {
    this.#drawCtx.clearRect(
      0,
      0,
      this.#drawCanvas.width,
      this.#drawCanvas.height,
    );

    this.#picCtx.clearRect(0, 0, this.#picCanvas.width, this.#picCanvas.height);
  }

  /**
   * Disables drawing input (e.g. once the action timer runs out).
   *
   * @returns {void}
   */
  disableDrawing() {
    this.#drawingEnabled = false;
    this.#drawCanvas.style.cursor = "not-allowed";
  }

  /**
   * Enables drawing input.
   *
   * @returns {void}
   */
  enableDrawing() {
    this.#drawingEnabled = true;
    this.#drawCanvas.style.cursor = "crosshair";
  }
}
