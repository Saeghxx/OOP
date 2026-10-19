export function rowsToCSV(rows) {
  const header = "Тип;x1;y1;x2;y2";
  const lines = rows.map(r =>
    [r.name, Math.round(r.x1), Math.round(r.y1), Math.round(r.x2), Math.round(r.y2)].join(';')
  );
  return [header, ...lines].join('\n');
}

export function downloadCSV(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function csvToRows(text) {
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const rows = [];
  let skipped = 0;
  let firstLine = true;

  for (const line of lines) {
    if (!line.trim()) continue;

    const sep = line.includes(';') ? ';' : ',';
    const parts = line.split(sep).map(s => s.trim());
    const nums = parts.slice(1).map(s => (s === '' ? NaN : Number(s)));
    const valid = parts.length === 5 && parts[0] !== '' && nums.every(Number.isFinite);

    if (valid) {
      rows.push({ name: parts[0], x1: nums[0], y1: nums[1], x2: nums[2], y2: nums[3] });
    } else if (!firstLine) {
      skipped++;
    }
    firstLine = false;
  }
  return { rows, skipped };
}