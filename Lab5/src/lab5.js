import { MyEditor } from './MyEditor.js';

const canvas = document.getElementById('drawArea');
const titleText = document.getElementById('titleText');

let editor = MyEditor.getInstance(canvas, titleText);

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

document.getElementById('itemToggleTable').addEventListener('click', () => {
  editor.table.toggle();
});

document.getElementById('itemExportCSV').addEventListener('click', () => {
  editor.exportCSV();
});

document.getElementById('itemAbout').addEventListener('click', () => {
  alert(
    "Lab5 — багатовіконний інтерфейс (JS-аналог)\n" +
    "Варіант Ж = 24 (парний) -> класичний Singleton MyEditor."
  );
});

document.getElementById('itemExit').addEventListener('click', () => {
  MyEditor.destroyInstance();
  alert(
    "Програму завершено: MyEditor і вікно таблиці знищено.\n" +
    "Перезавантаж сторінку, щоб почати заново."
  );
});