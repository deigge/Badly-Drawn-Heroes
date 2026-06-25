export class Scene {
  update() {
    throw new Error("update() must be implemented");
  }

  render(ctx) {
    throw new Error("render() must be implemented");
  }
}
