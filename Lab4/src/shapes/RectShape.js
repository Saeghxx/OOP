import { Shape } from './Shape.js';

export class RectShape extends Shape {
  constructor(cx, cy, cornerX, cornerY) {
    super();
    this.cx = cx; this.cy = cy;
    this.cornerX = cornerX; this.cornerY = cornerY;
  }

  Show(ctx) {
    const halfW = Math.abs(this.cornerX - this.cx);
    const halfH = Math.abs(this.cornerY - this.cy);
    const x = this.cx - halfW;
    const y = this.cy - halfH;
    const w = halfW * 2;
    const h = halfH * 2;

    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }
}