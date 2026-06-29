export class SceneSwitcher {
  #listener = null;

  onSceneComplete(listener) {
    this.#listener = listener;
  }

  notify(nextScene) {
    this.#listener?.(nextScene);
  }
}
