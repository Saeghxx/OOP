import { PointShape } from './shapes/PointShape.js';
import { LineShape } from './shapes/LineShape.js';
import { RectShape } from './shapes/RectShape.js';
import { EllipseShape } from './shapes/EllipseShape.js';
import { LineWithCirclesShape } from './shapes/LineWithCirclesShape.js';
import { CubeWireframeShape } from './shapes/CubeWireframeShape.js';
import { ShapeContainer } from './shapeContainer.js';
const SHAPE_NAMES = {
  point: 'Крапка',
  line: 'Лінія',
  rect: 'Прямокутник',
  ellipse: 'Еліпс',
  linecircles: 'Лінія з кружечками',
  cube: 'Каркас куба'
};
export class MyEditor {
  constructor(canvas, titleEl) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.titleEl = titleEl;
    this.shapes = new ShapeContainer();
    this.currentShapeType = 'rect';
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseup', this._onMouseUp);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this._updateTitle();
    this.redraw();
    console.log('MyEditor: об\'єкт створено (аналог new MyEditor())');
  }
  setShapeType(type) {
    this.currentShapeType = type;
    this._updateTitle();
  }
  clear() {
    this.shapes.clear();
    this.redraw();
  }
  _updateTitle() {
    if (this.titleEl) {
      this.titleEl.textContent = `Lab4 — ${SHAPE_NAMES[this.currentShapeType]}`;
    }
  }
  _getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
 
  _createShape(type, x1, y1, x2, y2) {
    switch (type) {
      case 'line':        return new LineShape(x1, y1, x2, y2);
      case 'rect':        return new RectShape(x1, y1, x2, y2);
      case 'ellipse':     return new EllipseShape(x1, y1, x2, y2);
      case 'linecircles': return new LineWithCirclesShape(x1, y1, x2, y2);
      case 'cube':        return new CubeWireframeShape(x1, y1, x2, y2);
      default:            return null;
    }
  }

  _drawRubberBand(x1, y1, x2, y2) {
    const shape = this._createShape(this.currentShapeType, x1, y1, x2, y2);
    if (!shape) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.setLineDash([5, 5]);
    shape.Show(ctx, true);
    ctx.restore();
  }
  _onMouseDown(e) {
    const { x, y } = this._getMousePos(e);
    if (this.currentShapeType === 'point') {
      this.shapes.push(new PointShape(x, y));
      this.redraw();
      return;
    }
    this.isDragging = true;
    this.startX = x;
    this.startY = y;
  }
  _onMouseMove(e) {
    if (!this.isDragging) return;
    const { x, y } = this._getMousePos(e);
    this.redraw();
    this._drawRubberBand(this.startX, this.startY, x, y);
  }
  _onMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const { x, y } = this._getMousePos(e);
    const shape = this._createShape(this.currentShapeType, this.startX, this.startY, x, y);
    if (shape) this.shapes.push(shape);
    this.redraw();
  }
  _onMouseLeave() {
    if (this.isDragging) {
      this.isDragging = false;
      this.redraw();
    }
  }
  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach(shape => shape.Show(this.ctx));
  }
  destroy() {
    this.canvas.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseup', this._onMouseUp);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    this.shapes.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log('MyEditor: об\'єкт знищено (аналог delete editor;)');
  }
}
