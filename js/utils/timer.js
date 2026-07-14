/**
 * A simple second-based countdown timer, used to time the drawing minigame.
 */
export class Timer {
  #duration;
  #remaining;
  #intervalId = null;

  /**
   * @param {number} durationSeconds - Countdown duration in whole seconds.
   */
  constructor(durationSeconds) {
    this.#duration = durationSeconds;
    this.#remaining = durationSeconds;
  }

  /**
   * Starts (or restarts) the countdown, firing `onTick` immediately and
   * then once per second as it counts down. Calls `onFinish` and stops
   * itself once the timer reaches zero.
   *
   * @param {(remaining: number) => void} onTick - Called with the remaining seconds, including the initial value.
   * @param {() => void} onFinish - Called once the countdown reaches zero.
   * @returns {void}
   */
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

  /**
   * Stops the countdown, if running. Safe to call even if it isn't.
   *
   * @returns {void}
   */
  stop() {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
  }
}
