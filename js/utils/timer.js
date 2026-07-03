export class Timer {
  #duration;
  #remaining;
  #intervalId = null;

  constructor(durationSeconds) {
    this.#duration = durationSeconds;
    this.#remaining = durationSeconds;
  }

  start(onTick, onFinish) {
    this.stop();
    this.#remaining = this.#duration;
    onTick(this.#remaining);

    this.#intervalId = setInterval(() => {
      this.#remaining--;
      onTick(this.#remaining);

      if (this.#remaining <= 0) {
        this.stop();
        onFinish();
      }
    }, 1000);
  }

  stop() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }
}
