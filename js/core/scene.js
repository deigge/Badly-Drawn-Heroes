/**
 * Base class for all scenes (e.g. level selection, game, finished, dead).
 * Subclasses must implement `update`, `render`, and `destroy`; the `GameLoop`
 * calls these on whichever scene is currently active.
 */
export class Scene {
  /**
   * Advances the scene's state by one frame.
   *
   * @param {number} delta - Time elapsed since the last frame, in milliseconds.
   * @returns {void}
   */
  update(delta) {
    throw new Error("update() must be implemented");
  }

  /**
   * Draws the current state of the scene to the canvas.
   *
   * @returns {void}
   */
  render() {
    throw new Error("render() must be implemented");
  }

  /**
   * Cleans up the scene (e.g. removes event listeners) before it is replaced.
   *
   * @returns {void}
   */
  destroy() {
    throw new Error("destroy() must be implemented");
  }
}
