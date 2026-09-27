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