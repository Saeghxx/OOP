import { PointShape } from './shapes/PointShape.js';
import { LineShape } from './shapes/LineShape.js';
import { RectShape } from './shapes/RectShape.js';
import { EllipseShape } from './shapes/EllipseShape.js';
import { ShapeContainer } from './shapeContainer.js';

const canvas = document.getElementById('drawArea');
const ctx = canvas.getContext('2d');
const titleText = document.getElementById('titleText');

const shapes = new ShapeContainer();

let currentShapeType = 'rect';

const SHAPE_NAMES = {
  point: 'Крапка',
  line: 'Лінія',
  rect: 'Прямокутник',
  ellipse: 'Еліпс'
};

let isDragging = false;
let startX = 0, startY = 0;

function updateTitle() {
  titleText.textContent = `Lab3 — ${SHAPE_NAMES[currentShapeType]}`;
}

function setShapeType(type) {
  currentShapeType = type;
  updateTitle(); 
}

updateTitle(); 

document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const menu = btn.parentElement;
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
    if (!isOpen) menu.classList.add('open');
    e.stopPropagation();
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
});

document.querySelectorAll('#menuObjects .menu-item[data-shape]').forEach(item => {
  item.addEventListener('click', () => setShapeType(item.dataset.shape));
});

document.getElementById('itemClear').addEventListener('click', () => {
  shapes.clear();
  redraw();
});

document.getElementById('itemAbout').addEventListener('click', () => {
  alert(
    "Lab3 — графічний редактор з Toolbar (JS-аналог)\n" +
    "Варіант Ж = 25: статичний масив (N=125), " +
    "прямокутник з білою заливкою, еліпс без заливки."
  );
});

document.querySelectorAll('#toolbar .tool-btn[data-shape]').forEach(btn => {
  btn.addEventListener('click', () => setShapeType(btn.dataset.shape));
});

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function drawRubberBand(x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.setLineDash([]); 
  ctx.lineWidth = 1;

  if (currentShapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

  } else if (currentShapeType === 'rect') {
   
    const halfW = Math.abs(x2 - x1), halfH = Math.abs(y2 - y1);
    ctx.strokeRect(x1 - halfW, y1 - halfH, halfW * 2, halfH * 2);

  } else if (currentShapeType === 'ellipse') {
  
    const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    const rx = Math.abs(x2 - x1) / 2, ry = Math.abs(y2 - y1) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

canvas.addEventListener('mousedown', (e) => {
  const { x, y } = getMousePos(e);

  if (currentShapeType === 'point') {
    shapes.push(new PointShape(x, y));
    redraw();
    return;
  }

  isDragging = true;
  startX = x;
  startY = y;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const { x, y } = getMousePos(e);
  redraw();
  drawRubberBand(startX, startY, x, y);
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const { x, y } = getMousePos(e);

  let newShape = null;
  if (currentShapeType === 'line') {
    newShape = new LineShape(startX, startY, x, y);
  } else if (currentShapeType === 'rect') {
   
    newShape = new RectShape(startX, startY, x, y);
  } else if (currentShapeType === 'ellipse') {
 
    newShape = new EllipseShape(startX, startY, x, y);
  }

  if (newShape) shapes.push(newShape);
  redraw();
});

canvas.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    redraw();
  }
});

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => shape.Show(ctx));
}

redraw();