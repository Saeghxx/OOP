import { PointShape } from './shapes/PointShape.js';
import { LineShape } from './shapes/LineShape.js';
import { RectShape } from './shapes/RectShape.js';
import { EllipseShape } from './shapes/EllipseShape.js';
import { LineWithCirclesShape } from './shapes/LineWithCirclesShape.js';
import { CubeWireframeShape } from './shapes/CubeWireframeShape.js';
import { ShapeContainer } from './shapes/shapeContainer.js';
import { MyTable } from './shapes/MyTable.js';
import { rowsToCSV, downloadCSV } from './shapes/csvExport.js';

const SHAPE_NAMES = {
  point: 'Крапка', line: 'Лінія', rect: 'Прямокутник', ellipse: 'Еліпс',
  linecircles: 'Лінія з кружечками', cube: 'Каркас куба'
};

export class MyEditor {
  
  static _instance = null;

  constructor(canvas, titleEl) {
   
    if (MyEditor._instance) {
      throw new Error("MyEditor вже існує — використовуйте MyEditor.getInstance()");
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.titleEl = titleEl;

    this.shapes = new ShapeContainer();
    this.currentShapeType = 'rect';
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.selectedIndex = null; 

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);

    this.canvas.addEventListener('mousedown', this._onMouseDown);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseup', this._onMouseUp);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);

    this.table = new MyTable(document.body, (index) => {
      this.selectedIndex = index;
      this.redraw();
    });

    this._updateTitle();
    this.redraw();

    MyEditor._instance = this; 
    console.log("MyEditor: єдиний екземпляр створено (класичний Singleton)");
  }

  static getInstance(canvas, titleEl) {
    if (!MyEditor._instance) {
      new MyEditor(canvas, titleEl); 
    }
    return MyEditor._instance;
  }

  static destroyInstance() {
    if (MyEditor._instance) {
      MyEditor._instance._destroy();
      MyEditor._instance = null;
    }
  }

  setShapeType(type) {
    this.currentShapeType = type;
    this._updateTitle();
  }

  clear() {
    this.shapes.clear();
    this.selectedIndex = null;
    this.redraw();
    this._refreshTable();
  }

  exportCSV() {
    downloadCSV('shapes.csv', rowsToCSV(this._getRows()));
  }

  _getRows() {
    const rows = [];
    this.shapes.forEach(shape => {
      rows.push({ name: shape.getTypeName(), ...shape.getBounds() });
    });
    return rows;
  }

  _refreshTable() {
    this.table.setRows(this._getRows());
  }

  _updateTitle() {
    if (this.titleEl) {
      this.titleEl.textContent = `Lab5 — ${SHAPE_NAMES[this.currentShapeType]}`;
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

  _drawHighlight() {
    if (this.selectedIndex === null) return;
    const shape = this.shapes.get(this.selectedIndex);
    if (!shape) return;
    const b = shape.getBounds();
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.setLineDash([4, 3]);
    ctx.lineWidth = 2;
    const x = Math.min(b.x1, b.x2) - 4, y = Math.min(b.y1, b.y2) - 4;
    const w = Math.abs(b.x2 - b.x1) + 8, h = Math.abs(b.y2 - b.y1) + 8;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  _onMouseDown(e) {
    const { x, y } = this._getMousePos(e);
    if (this.currentShapeType === 'point') {
      this.shapes.push(new PointShape(x, y));
      this.redraw();
      this._refreshTable();
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
    if (shape) {
      this.shapes.push(shape);
      this._refreshTable();
    }
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
    this._drawHighlight();
  }

  _destroy() {
    this.canvas.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseup', this._onMouseUp);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    this.shapes.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.table.close();
    console.log("MyEditor: єдиний екземпляр знищено");
  }
}