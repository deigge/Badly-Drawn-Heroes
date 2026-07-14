/**
 * Simple on-screen debug panel showing FPS, frame count, current scene,
 * and frame delta. Renders into an existing DOM element rather than the canvas.
 */
export class DebugOverlay {
  #el;
  #enabled = true;

  /**
   * @param {string} [elementId="debugOverlay"] - ID of the element to render debug info into.
   */
  constructor(elementId = "debugOverlay") {
    this.#el = document.getElementById(elementId);
  }

  /**
   * Shows or hides the overlay.
   *
   * @param {boolean} value - Whether the overlay should be visible.
   * @returns {void}
   */
  setEnabled(value) {
    this.#enabled = value;
    this.#el.style.display = value ? "block" : "none";
  }

  /**
   * Updates the displayed debug info. No-op while disabled.
   *
   * @param {{fps: number, frame: number, sceneName: string, delta: number}} stats
   * @returns {void}
   */
  update({ fps, frame, sceneName, delta }) {
    if (!this.#enabled) return;

    this.#el.innerHTML = `
      <div>FPS: ${fps}</div>
      <div>Frame: ${frame}</div>
      <div>Scene: ${sceneName}</div>
      <div>Delta: ${delta.toFixed(2)}</div>
    `;
  }
}
