const INITIAL_CAPACITY = 124; 

export class ShapeContainer {
  constructor(initialCapacity = INITIAL_CAPACITY) {
    this._capacity = initialCapacity;
    this._array = new Array(this._capacity); 
    this._count = 0;
  }

  push(shape) {
    if (this._count >= this._capacity) {
    
      this._capacity *= 2;
      const grown = new Array(this._capacity);
      for (let i = 0; i < this._count; i++) grown[i] = this._array[i];
      this._array = grown;
    }
    this._array[this._count++] = shape;
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