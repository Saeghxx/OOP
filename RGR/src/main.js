import { Viewer } from "./viewer.js";
import { Toolbar } from "./toolbar.js";
import { Files } from "./files.js";

const viewer = new Viewer(document.getElementById("cv"), document.getElementById("status"));
const toolbar = new Toolbar(document.getElementById("toolbar"), viewer);
const files = new Files(viewer);

const menu = document.getElementById("menu");
const items = [["Новий", () => files.newScene()], ["Відкрити…", () => files.open()],
               ["Записати", () => files.save()], ["Записати як…", () => files.saveAs()]];
menu.innerHTML = '<div class="mi"><button>Файл</button><div class="dd"></div></div>';
items.forEach(([t, f]) => {
  const b = document.createElement("button"); b.textContent = t; b.onclick = f;
  menu.querySelector(".dd").appendChild(b);
});
viewer.render();