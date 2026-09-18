export function Func_MOD1(overlay, dialogBox) {
  return new Promise((resolve) => {

    const groups = ["ІП-01", "ІП-02", "ІП-03", "ІП-04", "ІО-01", "ІО-02"];

    dialogBox.innerHTML = `
      <h3>Робота1 — оберіть групу (В1 = 3, ListBox)</h3>
      <select id="listBox" size="6" style="width:220px;"></select><br><br>
      <button id="btnOk1">Так</button>
      <button id="btnCancel1">Відміна</button>
    `;

    const listBox = dialogBox.querySelector('#listBox');
    const btnOk = dialogBox.querySelector('#btnOk1');
    const btnCancel = dialogBox.querySelector('#btnCancel1');

    groups.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      listBox.appendChild(opt);
    });
    listBox.selectedIndex = 0;

    overlay.classList.remove('hidden'); 

    function onOk() {
      
      const selected = listBox.value;
      close();
      resolve(selected);  
    }

    function onCancel() {
      close();
      resolve(0);         
    }

    function close() {
      overlay.classList.add('hidden');
      btnOk.removeEventListener('click', onOk);
      btnCancel.removeEventListener('click', onCancel);
    }

    btnOk.addEventListener('click', onOk);
    btnCancel.addEventListener('click', onCancel);
  });
}