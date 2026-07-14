/**
 * Simple event bridge that lets a scene signal it has finished, without
 * needing to know about `GameLoop` or how the next scene is created.
 * Scenes call `notify()`; `main.js` registers a listener via `onSceneComplete()`
 * to decide which scene to switch to.
 */
export class SceneSwitcher {
  #listener = null;

  /**
   * Registers the callback to invoke when a scene reports completion.
   * Only one listener is supported; calling this again replaces the previous one.
   *
   * @param {(nextScene: string) => void} listener - Called with the identifier of the next scene.
   * @returns {void}
   */
  onSceneComplete(listener) {
    this.#listener = listener;
  }

  /**
   * Signals that the current scene is done and which scene should follow.
   *
   * @param {string} nextScene - Identifier of the next scene (e.g. "game", "finished", "dead").
   * @returns {void}
   */
  notify(nextScene) {
    this.#listener?.(nextScene);
  }
}
