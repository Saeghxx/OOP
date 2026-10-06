const FIXED_CAPACITY = 125;

export class ShapeContainer {
  #capacity;
  #array;
  #count = 0;

  constructor(capacity = FIXED_CAPACITY) {
    this.#capacity = capacity;
    this.#array = new Array(capacity);
  }

  push(shape) {
    if (this.#count >= this.#capacity) {
      console.warn(`Масив заповнено (N=${this.#capacity}), нову фігуру не додано`);
      return;
    }
    this.#array[this.#count++] = shape;
  }

  get count() {
    return this.#count;
  }

  get capacity() {
    return this.#capacity;
  }

  forEach(callback) {
    for (let i = 0; i < this.#count; i++) callback(this.#array[i], i);
  }

  clear() {
    this.#count = 0;
  }
}