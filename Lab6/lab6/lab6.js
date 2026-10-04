const dialogOverlay = document.getElementById('dialogOverlay');
const statusEl = document.getElementById('status');

let object2Win = null;
let object3Win = null;

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (kind ? ' ' + kind : '');
}

document.getElementById('btnRun').addEventListener('click', () => {
  dialogOverlay.classList.remove('hidden');
});

document.getElementById('btnCancel').addEventListener('click', () => {
  dialogOverlay.classList.add('hidden');
});

document.getElementById('btnOk').addEventListener('click', () => {
  const nPoint = parseInt(document.getElementById('inNPoint').value, 10);
  const xMin = parseInt(document.getElementById('inXMin').value, 10);
  const xMax = parseInt(document.getElementById('inXMax').value, 10);
  const yMin = parseInt(document.getElementById('inYMin').value, 10);
  const yMax = parseInt(document.getElementById('inYMax').value, 10);

  if (!nPoint || nPoint < 1 || xMin >= xMax || yMin >= yMax) {
    alert('Перевір значення: nPoint > 0, xMin < xMax, yMin < yMax');
    return;
  }

  dialogOverlay.classList.add('hidden');
  runSystem(nPoint, xMin, xMax, yMin, yMax);
});

function runSystem(nPoint, xMin, xMax, yMin, yMax) {
  
  closeChildren();

  const params = new URLSearchParams({ nPoint, xMin, xMax, yMin, yMax }).toString();

  setStatus('Запускаю Object2…');

  object2Win = window.open(
    `../object2/index.html?${params}`,
    'Object2Window',
    'width=420,height=460,left=440,top=0'
  );

  setTimeout(() => {
    setStatus('Object2 запущено. Запускаю Object3…');

    object3Win = window.open(
      `../object3/index.html`,
      'Object3Window',
      'width=560,height=460,left=870,top=0'
    );

    setStatus(
      'Object2 і Object3 запущено.\n' +
      'Дивись їхні вікна — Object2 показав точки й записав їх у буфер обміну,\n' +
      'Object3 повинен був автоматично прочитати буфер і побудувати графік.'
    );
  }, 800); 
}

document.getElementById('btnStop').addEventListener('click', () => {
  closeChildren();
  setStatus('Object2 і Object3 завершено (закрито).');
});

function closeChildren() {
 
  if (object2Win && !object2Win.closed) object2Win.close();
  if (object3Win && !object3Win.closed) object3Win.close();
  object2Win = null;
  object3Win = null;
}

window.addEventListener('beforeunload', closeChildren);