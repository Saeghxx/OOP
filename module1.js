export function Func_MOD1(overlay, dialogBox) {
  return new Promise((resolve) => {

    const groups = ["IM-51", "IM-52", "IM-53", "IM-54", "IM-55", "IM-56",
       "IM-57", "IM-58", "IM-59", "IM-60", "IM-61", "IM-62", "IM-63", "IM-64", "IM-65", "IM-66",
        "IM-67", "IM-68", "IM-69", "IM-70"];

    dialogBox.innerHTML = `
      <h3>Робота1</h3>
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