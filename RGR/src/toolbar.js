export class Toolbar {
  static icons = {
    Select: '<path d="M10 4l16 10-7 2 5 9-4 2-5-9-5 5z" fill="#fff" stroke="#000"/>',
    Line: '<path d="M6 8L32 26" stroke="#000" stroke-width="2"/>',
    Arrow: '<path d="M6 26L30 10M30 10l-9 1M30 10l-3 8" stroke="#000" stroke-width="2" fill="none"/>',
    Rect: '<rect x="9" y="5" width="20" height="24" fill="#ffc000" stroke="#000"/>',
    Ellipse: '<ellipse cx="19" cy="17" rx="14" ry="9" fill="#c6efce" stroke="#000"/>',
    Cube: '<path d="M6 12h16v16H6zM6 12l6-6h16l-6 6M22 12l6-6v16l-6 6" fill="#fff" stroke="#000"/>',
    Cylinder: '<path d="M8 9v16a11 4 0 0 0 22 0V9" fill="#cfe8f7" stroke="#000"/><ellipse cx="19" cy="9" rx="11" ry="4" fill="#cfe8f7" stroke="#000"/>',
    Rhombus: '<path d="M19 4l14 13-14 13L5 17z" fill="#ffffcc" stroke="#000"/>',
    TextShape: '<text x="9" y="26" font-size="24" font-family="serif" font-weight="bold">T</text>'
  };
  static tips = {
    Select: "Вибір / переміщення (Delete – видалити)", Line: "Відрізок", Arrow: "Стрілка",
    Rect: "Прямокутник", Ellipse: "Еліпс", Cube: "Куб", Cylinder: "Циліндр",
    Rhombus: "Ромб", TextShape: "Текст (клік на полотні)"
  };
  constructor(host, viewer) {
    this.viewer = viewer; this.buttons = {};
    for (const name in Toolbar.icons) {
      const b = document.createElement("button");
      b.className = "tb"; b.dataset.tip = Toolbar.tips[name]; b.title = Toolbar.tips[name];
      b.innerHTML = `<svg viewBox="0 0 38 34">${Toolbar.icons[name]}</svg>`;
      b.onclick = () => this.select(name);
      host.appendChild(b); this.buttons[name] = b;
    }
    this.select("Select");
  }
  select(name) {
    this.viewer.tool = name;
    for (const n in this.buttons) this.buttons[n].classList.toggle("on", n === name);
    this.viewer.cv.style.cursor = name === "Select" ? "default" : "crosshair";
  }
}