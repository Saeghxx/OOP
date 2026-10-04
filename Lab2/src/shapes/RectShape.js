import { Shape } from './Shape.js';

export class RectShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super();
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  Show(ctx) {
    const x = Math.min(this.x1, this.x2);
    const y = Math.min(this.y1, this.y2);
    const w = Math.abs(this.x2 - this.x1);
    const h = Math.abs(this.y2 - this.y1);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h); 
  }
}