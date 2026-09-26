import { Shape } from './Shape.js';

export class EllipseShape extends Shape {
  constructor(cx, cy, rx, ry) {
    super();
    this.cx = cx; this.cy = cy;
    this.rx = rx; this.ry = ry;
  }

  Show(ctx) {
    ctx.beginPath();
    ctx.ellipse(this.cx, this.cy, Math.max(this.rx, 1), Math.max(this.ry, 1), 0, 0, Math.PI * 2);
    ctx.fillStyle = "gray";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}