import { MyEditor } from './MyEditor.js';

const canvas = document.getElementById('drawArea');
const titleText = document.getElementById('titleText');

let editor = null;

function createEditor() {
  if (editor) {
    editor.destroy(); 
  }
  editor = new MyEditor(canvas, titleText); 
}

createEditor(); 

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
  item.addEventListener('click', () => editor.setShapeType(item.dataset.shape));
});
document.querySelectorAll('#toolbar .tool-btn[data-shape]').forEach(btn => {
  btn.addEventListener('click', () => editor.setShapeType(btn.dataset.shape));
});

document.getElementById('itemClear').addEventListener('click', () => editor.clear());

document.getElementById('itemAbout').addEventListener('click', () => {
  alert(
    "Lab4 — вдосконалена структура коду (JS-аналог)\n" +
    "Варіант Ж = 24 (парний) -> динамічний об'єкт MyEditor."
  );
});

document.getElementById('itemRecreate').addEventListener('click', () => {
  createEditor();
  alert(
    "MyEditor знищено і створено заново.\n" +
    "Відкрий консоль браузера (F12), щоб побачити обидва повідомлення."
  );
});