export function Func_MOD2(overlay, dialogBox) {
  return new Promise((resolve) => {

    dialogBox.innerHTML = `
      <h3>Робота2 — введіть текст (В2 = 0, Edit Control)</h3>
      <input type="text" id="editControl" style="width:220px;" placeholder="Введіть рядок тексту"><br><br>
      <button id="btnOk2">Так</button>
      <button id="btnCancel2">Відміна</button>
    `;

    const edit = dialogBox.querySelector('#editControl');
    const btnOk = dialogBox.querySelector('#btnOk2');
    const btnCancel = dialogBox.querySelector('#btnCancel2');

    overlay.classList.remove('hidden'); 
    edit.focus();                       

    function onOk() {

      const text = edit.value.trim();
      close();
      resolve(text.length > 0 ? text : 0);  
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

    edit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') onOk();
    });
  });
}