export class MyTable {

  constructor(container, onRowSelect, onRowDelete) {
    this._onRowSelect = onRowSelect;
    this._onRowDelete = onRowDelete;
    this._isOpen = false;
    this._selected = null;
    this._buildDOM(container);
  }

  _buildDOM(container) {
    this._panel = document.createElement('div');
    this._panel.id = 'myTablePanel';
    this._panel.className = 'my-table-panel hidden';
    this._panel.tabIndex = -1;
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
      <div class="my-table-footer">
        <button class="my-table-delete" disabled title="Видалити виділений об'єкт (Delete)">Видалити виділений</button>
      </div>
    `;
    container.appendChild(this._panel);
    this._tbody = this._panel.querySelector('tbody');
    this._deleteBtn = this._panel.querySelector('.my-table-delete');

    this._panel.querySelector('.my-table-close').addEventListener('click', () => this.close());
    this._deleteBtn.addEventListener('click', () => this._deleteSelected());
    this._panel.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') this._deleteSelected();
    });
  }

  _deleteSelected() {
    if (this._selected === null) return;
    if (this._onRowDelete) this._onRowDelete(this._selected);
  }

  _markSelected(index) {
    this._selected = index;
    this._tbody.querySelectorAll('tr').forEach((r, i) => {
      r.classList.toggle('selected', i === index);
    });
    this._deleteBtn.disabled = (index === null);
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

  setRows(rows, selectedIndex = null) {
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
        this._markSelected(i);
        this._panel.focus();
        if (this._onRowSelect) this._onRowSelect(i);
      });
      this._tbody.appendChild(tr);
    });
    const valid = selectedIndex !== null && selectedIndex < rows.length;
    this._markSelected(valid ? selectedIndex : null);
  }
}