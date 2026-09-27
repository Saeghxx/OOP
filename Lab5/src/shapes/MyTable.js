export class MyTable {
  constructor(container, onRowSelect) {
    this._onRowSelect = onRowSelect; 
    this._isOpen = false;
    this._buildDOM(container);
  }

  _buildDOM(container) {
    this._panel = document.createElement('div');
    this._panel.id = 'myTablePanel';
    this._panel.className = 'my-table-panel hidden';

    this._panel.innerHTML = `
      <div class="my-table-header">
        <span>Таблиця об'єктів</span>
        <button class="my-table-close" title="Закрити">×</button>
      </div>
      <div class="my-table-body">
        <table>
          <thead>
            <tr><th>Назва</th><th>x1</th><th>y1</th><th>x2</th><th>y2</th></tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;

    container.appendChild(this._panel);

    this._tbody = this._panel.querySelector('tbody');
    this._panel.querySelector('.my-table-close').addEventListener('click', () => this.close());
  }

  open() {
    this._panel.classList.remove('hidden');
    this._isOpen = true;
  }

  close() {
    this._panel.classList.add('hidden');
    this._isOpen = false;
  }

  toggle() {
    this._isOpen ? this.close() : this.open();
  }

  isOpen() {
    return this._isOpen;
  }

  setRows(rows) {
    this._tbody.innerHTML = '';
    rows.forEach((row, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.name}</td>
        <td>${Math.round(row.x1)}</td>
        <td>${Math.round(row.y1)}</td>
        <td>${Math.round(row.x2)}</td>
        <td>${Math.round(row.y2)}</td>
      `;
      tr.addEventListener('click', () => {
        this._tbody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        if (this._onRowSelect) this._onRowSelect(i); 
      });
      this._tbody.appendChild(tr);
    });
  }
}