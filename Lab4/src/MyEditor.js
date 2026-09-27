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

  _drawRubberBand(x1, y1, x2, y2) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.setLineDash([5, 5]); 
    ctx.lineWidth = 1;

    if (this.currentShapeType === 'line' || this.currentShapeType === 'linecircles') {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    } else if (this.currentShapeType === 'rect' || this.currentShapeType === 'cube') {
      const halfW = Math.abs(x2 - x1), halfH = Math.abs(y2 - y1);
      ctx.strokeRect(x1 - halfW, y1 - halfH, halfW * 2, halfH * 2);
    } else if (this.currentShapeType === 'ellipse') {
      const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
      const rx = Math.abs(x2 - x1) / 2, ry = Math.abs(y2 - y1) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
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

    let shape = null;
    switch (this.currentShapeType) {
      case 'line':        shape = new LineShape(this.startX, this.startY, x, y); break;
      case 'rect':         shape = new RectShape(this.startX, this.startY, x, y); break;
      case 'ellipse':      shape = new EllipseShape(this.startX, this.startY, x, y); break;
      case 'linecircles':  shape = new LineWithCirclesShape(this.startX, this.startY, x, y); break;
      case 'cube':         shape = new CubeWireframeShape(this.startX, this.startY, x, y); break;
    }
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