import { Shape } from './Shape.js';
import { LineShape } from './LineShape.js';
import { EllipseShape } from './EllipseShape.js';

const CIRCLE_RADIUS = 6;

export class LineWithCirclesShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super();
   
    this._line = new LineShape(x1, y1, x2, y2);
   
    const r = CIRCLE_RADIUS;
    this._circle1 = new EllipseShape(x1 - r, y1 - r, x1 + r, y1 + r);
    this._circle2 = new EllipseShape(x2 - r, y2 - r, x2 + r, y2 + r);
  }

  Show(ctx) {
    this._line.Show(ctx);     
    this._circle1.Show(ctx);  
    this._circle2.Show(ctx); 
  }
}