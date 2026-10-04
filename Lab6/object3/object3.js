const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const manualFallback = document.getElementById('manualFallback');

async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text || !text.trim()) throw new Error('empty');
    handleData(text);
  } catch (err) {
 
    statusEl.textContent =
      'Не вдалося автоматично прочитати буфер обміну (браузер заблокував доступ).';
    statusEl.className = 'status error';
    manualFallback.style.display = 'block';
  }
}

function parsePoints(text) {
  return text
    .trim()
    .split('\n')
    .map(line => {
      const [x, y] = line.split(',').map(Number);
      return { x, y };
    })
    .filter(p => !Number.isNaN(p.x) && !Number.isNaN(p.y));
}

function handleData(text) {
  const points = parsePoints(text);
  if (points.length === 0) {
    statusEl.textContent = 'У буфері обміну немає коректних даних.';
    statusEl.className = 'status error';
    manualFallback.style.display = 'block';
    return;
  }

  statusEl.textContent = `Отримано ${points.length} точок із буфера обміну ✓. Графік побудовано.`;
  statusEl.className = 'status ok';
  manualFallback.style.display = 'none';

  points.sort((a, b) => a.x - b.x);

  drawGraph(points);
}

function drawGraph(points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 40;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);

  const toPx = (p) => {
    const px = pad + (p.x - xMin) / (xMax - xMin || 1) * (canvas.width - 2 * pad);
    const py = canvas.height - pad - (p.y - yMin) / (yMax - yMin || 1) * (canvas.height - 2 * pad);
    return { px, py };
  };

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, canvas.height - pad);
  ctx.lineTo(canvas.width - pad, canvas.height - pad); 
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, canvas.height - pad); // вісь Y
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.font = '11px sans-serif';
  ctx.fillText(String(xMin), pad - 4, canvas.height - pad + 14);
  ctx.fillText(String(xMax), canvas.width - pad - 10, canvas.height - pad + 14);
  ctx.fillText(String(yMin), pad - 28, canvas.height - pad);
  ctx.fillText(String(yMax), pad - 28, pad + 4);
  ctx.fillText('x', canvas.width - pad + 6, canvas.height - pad + 4);
  ctx.fillText('y', pad - 4, pad - 6);

  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => {
    const { px, py } = toPx(p);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  });
  ctx.stroke();

  ctx.fillStyle = 'red';
  points.forEach(p => {
    const { px, py } = toPx(p);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

document.getElementById('btnRetry').addEventListener('click', readFromClipboard);

document.getElementById('btnBuildManual').addEventListener('click', () => {
  const text = document.getElementById('manualInput').value;
  handleData(text);
});

readFromClipboard();