import { Shape } from './Shape.js';

export class LineShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  Show(ctx) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }

  getTypeName() { return "Лінія"; }
  getBounds() { return { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 }; }
}