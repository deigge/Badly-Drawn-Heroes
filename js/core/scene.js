export class Scene {
  update() {
    throw new Error("update() must be implemented");
  }

  render() {
    throw new Error("render() must be implemented");
  }

  destroy() {
    throw new Error("destroy() must be implemented");
  }
}
