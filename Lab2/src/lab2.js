import { PointShape } from './shapes/PointShape.js';
import { LineShape } from './shapes/LineShape.js';
import { RectShape } from './shapes/RectShape.js';
import { EllipseShape } from './shapes/EllipseShape.js';
import { ShapeContainer } from './shapeContainer.js';

const canvas = document.getElementById('drawArea');
const ctx = canvas.getContext('2d');

const shapes = new ShapeContainer();

let currentShapeType = 'rect'; 

let isDragging = false;
let startX = 0, startY = 0;

const shapeMenuItems = document.querySelectorAll('#menuObjects .menu-item[data-shape]');

function onInitMenuPopup() {
  shapeMenuItems.forEach(item => {
    item.classList.toggle('checked', item.dataset.shape === currentShapeType);
  });
}

document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const menu = btn.parentElement;
    const isOpen = menu.classList.contains('open');
    document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
    if (!isOpen) {
      if (menu.id === 'menuObjects') onInitMenuPopup(); 
      menu.classList.add('open');
    }
    e.stopPropagation();
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.menu.open').forEach(m => m.classList.remove('open'));
});

shapeMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    currentShapeType = item.dataset.shape; 
  });
});

document.getElementById('itemClear').addEventListener('click', () => {
  shapes.clear();
  redraw();
});

document.getElementById('itemAbout').addEventListener('click', () => {
  alert(
    "Lab2 — графічний редактор об'єктів (JS-аналог)\n" +
    "Варіант Ж = 24: динамічний масив (N=124), " +
    "прямокутник без заповнення, еліпс із сірою заливкою."
  );
});

function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function drawRubberBand(x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = "black";
  ctx.setLineDash([]); 
  ctx.lineWidth = 1;

  if (currentShapeType === 'line') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  } else if (currentShapeType === 'rect') {
    
    const x = Math.min(x1, x2), y = Math.min(y1, y2);
    ctx.strokeRect(x, y, Math.abs(x2 - x1), Math.abs(y2 - y1));
  } else if (currentShapeType === 'ellipse') {
   
    ctx.beginPath();
    ctx.ellipse(x1, y1, Math.abs(x2 - x1), Math.abs(y2 - y1), 0, 0, Math.PI * 2);
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
    newShape = new EllipseShape(startX, startY, Math.abs(x - startX), Math.abs(y - startY));
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