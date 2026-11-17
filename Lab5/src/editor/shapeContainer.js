const FIXED_CAPACITY = 125;

export class ShapeContainer {
  constructor(capacity = FIXED_CAPACITY) {
    this._capacity = capacity;
    this._array = new Array(capacity);
    this._count = 0;
  }

  push(shape) {
    if (this._count >= this._capacity) {
      console.warn(`Масив заповнено (N=${this._capacity}), нову фігуру не додано`);
      return false;
    }
    this._array[this._count++] = shape;
    return true;
  }

  remove(index) {
    if (index < 0 || index >= this._count) return false;
    for (let i = index; i < this._count - 1; i++) {
      this._array[i] = this._array[i + 1];
    }
    this._array[--this._count] = undefined;
    return true;
  }

  get(index) {
    return this._array[index];
  }

  get count() {
    return this._count;
  }

  get capacity() {
    return this._capacity;
  }

  forEach(callback) {
    for (let i = 0; i < this._count; i++) callback(this._array[i], i);
  }

  clear() {
    this._count = 0;
  }
}