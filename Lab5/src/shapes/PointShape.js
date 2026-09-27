import { Shape } from './Shape.js';

export class PointShape extends Shape {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  Show(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  getTypeName() { return "Крапка"; }
  getBounds() { return { x1: this.x, y1: this.y, x2: this.x, y2: this.y }; }
}