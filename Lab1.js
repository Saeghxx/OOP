import { Func_MOD1 } from './module1.js';
import { Func_MOD2 } from './module2.js';

let lastText = "(ще нічого не обрано)";

const canvas = document.getElementById('paintArea');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('dialogOverlay');
const dialogBox = document.getElementById('dialogBox');

function onPaint() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px sans-serif";
  ctx.fillText("Результат останньої дії:", 20, 40);
  ctx.fillText(lastText, 20, 70);
}

document.getElementById('menuWork1').addEventListener('click', () => {
  
  Func_MOD1(overlay, dialogBox).then(result => {
    if (result !== 0) {          
      lastText = "Робота1 -> " + result;
      onPaint();                 
    }
  });
});

document.getElementById('menuWork2').addEventListener('click', () => {
  Func_MOD2(overlay, dialogBox).then(result => {
    if (result !== 0) {
      lastText = "Робота2 -> " + result;
      onPaint();
    }
  });
});

document.getElementById('menuClear').addEventListener('click', () => {
  lastText = "(ще нічого не обрано)";
  onPaint();
});

onPaint();