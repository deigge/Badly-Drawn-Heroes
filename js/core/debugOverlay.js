export class DebugOverlay {
  #el;
  #enabled = true;

  constructor(elementId = "debug") {
    this.#el = document.getElementById(elementId);
  }

  setEnabled(value) {
    this.#enabled = value;
    this.#el.style.display = value ? "block" : "none";
  }

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
