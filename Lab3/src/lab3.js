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

const shapeClasses = { line: LineShape, rect: RectShape, ellipse: EllipseShape };

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
  shapeClasses[currentShapeType].Rubber(ctx, startX, startY, x, y);
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const { x, y } = getMousePos(e);

  const ShapeClass = shapeClasses[currentShapeType];
  if (ShapeClass) shapes.push(new ShapeClass(startX, startY, x, y));

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