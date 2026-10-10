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
}
