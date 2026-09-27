import { Shape } from './Shape.js';

export class RectShape extends Shape {
  constructor(cx, cy, cornerX, cornerY) {
    super();
    this.cx = cx; this.cy = cy;
    this.cornerX = cornerX; this.cornerY = cornerY;
  }

  _boxCoords() {
    const halfW = Math.abs(this.cornerX - this.cx);
    const halfH = Math.abs(this.cornerY - this.cy);
    return {
      x: this.cx - halfW, y: this.cy - halfH,
      w: halfW * 2, h: halfH * 2
    };
  }

  Show(ctx) {
    const { x, y, w, h } = this._boxCoords();
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }

  getTypeName() { return "Прямокутник"; }

  getBounds() {
    const { x, y, w, h } = this._boxCoords();
    return { x1: x, y1: y, x2: x + w, y2: y + h };
  }
}