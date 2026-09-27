import { Shape } from './Shape.js';
import { RectShape } from './RectShape.js';
import { LineShape } from './LineShape.js';

const DEPTH_OFFSET = 18;

export class CubeWireframeShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super();

    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    this._front = new RectShape(cx, cy, x2, y2);

    const bx1 = x1 + DEPTH_OFFSET, by1 = y1 - DEPTH_OFFSET;
    const bx2 = x2 + DEPTH_OFFSET, by2 = y2 - DEPTH_OFFSET;
    const bcx = (bx1 + bx2) / 2, bcy = (by1 + by2) / 2;
    this._back = new RectShape(bcx, bcy, bx2, by2);

    this._edges = [
      new LineShape(x1, y1, bx1, by1),
      new LineShape(x2, y1, bx2, by1),
      new LineShape(x1, y2, bx1, by2),
      new LineShape(x2, y2, bx2, by2),
    ];
  }

  Show(ctx) {
    this._back.Show(ctx);
    this._edges.forEach(edge => edge.Show(ctx));
    this._front.Show(ctx);
  }

  getTypeName() { return "Каркас куба"; }

  getBounds() { return this._front.getBounds(); }
}