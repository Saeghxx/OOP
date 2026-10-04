const params = new URLSearchParams(window.location.search);
const nPoint = parseInt(params.get('nPoint'), 10) || 20;
const xMin = parseInt(params.get('xMin'), 10) || -10;
const xMax = parseInt(params.get('xMax'), 10) || 10;
const yMin = parseInt(params.get('yMin'), 10) || -10;
const yMax = parseInt(params.get('yMax'), 10) || 10;

document.getElementById('paramsInfo').textContent =
  `nPoint=${nPoint}, x∈[${xMin};${xMax}], y∈[${yMin};${yMax}]`;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const points = [];
for (let i = 0; i < nPoint; i++) {
  points.push({ x: randInt(xMin, xMax), y: randInt(yMin, yMax) });
}

const tbody = document.getElementById('pointsBody');
points.forEach((p, i) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${i + 1}</td><td>${p.x}</td><td>${p.y}</td>`;
  tbody.appendChild(tr);
});

const csvText = points.map(p => `${p.x},${p.y}`).join('\n');

const statusEl = document.getElementById('status');
const btnManual = document.getElementById('btnCopyManual');

async function writeToClipboard() {
  try {
    await navigator.clipboard.writeText(csvText);
    statusEl.textContent = `Згенеровано ${nPoint} точок. Дані записано в буфер обміну ✓`;
    statusEl.className = 'status ok';
  } catch (err) {

    statusEl.textContent =
      'Згенеровано точки, але браузер заблокував автоматичний запис у буфер обміну.\n' +
      'Натисни кнопку нижче, щоб скопіювати дані вручну.';
    statusEl.className = 'status error';
    btnManual.style.display = 'inline-block';
  }
}

btnManual.addEventListener('click', async () => {
  await navigator.clipboard.writeText(csvText);
  statusEl.textContent = 'Дані скопійовано в буфер обміну ✓';
  statusEl.className = 'status ok';
  btnManual.style.display = 'none';
});

writeToClipboard();