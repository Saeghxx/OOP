import { ShapeFactory, TextShape } from "./shape.js";

export class Viewer {
  constructor(canvas, status) {
    this.cv = canvas; this.ctx = canvas.getContext("2d"); this.status = status;
    this.shapes = []; this.tool = "Select"; this.current = null; this.selected = null;
    this.fills = { Rect: "#ffc000", Ellipse: "#c6efce", Cube: "#ffffff",
                   Cylinder: "#cfe8f7", Rhombus: "#ffffcc" };
    this.cv.addEventListener("mousedown", e => this.down(e));
    window.addEventListener("mousemove", e => this.moveEv(e));
    window.addEventListener("mouseup", e => this.up(e));
    window.addEventListener("keydown", e => {
      if (e.key === "Delete" && this.selected) {
        this.shapes = this.shapes.filter(s => s !== this.selected);
        this.selected = null; this.render();
      }
    });
  }
  pos(e) { const r = this.cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  down(e) {
    const [x, y] = this.pos(e);
    if (this.tool === "Select") {
      this.selected = [...this.shapes].reverse().find(s => s.hit(x, y)) || null;
      this.drag = this.selected ? [x, y] : null; this.render(); return;
    }
    if (this.tool === "TextShape") {
      const t = prompt("Введіть текст:", "Текст");
      if (t) { this.shapes.push(new TextShape(x, y, t)); this.render(); }
      return;
    }
    this.current = ShapeFactory.create(this.tool, x, y, x, y, this.fills[this.tool] || "#fff");
  }
  moveEv(e) {
    const [x, y] = this.pos(e);
    this.status.textContent = `x: ${Math.round(x)}  y: ${Math.round(y)}  | Фігур: ${this.shapes.length}`;
    if (this.current) { this.current.x2 = x; this.current.y2 = y; this.render(); }
    else if (this.drag) {
      this.selected.move(x - this.drag[0], y - this.drag[1]); this.drag = [x, y]; this.render();
    }
  }
  up() {
    if (this.current) {
      const b = this.current.box();
      if (b.w > 3 || b.h > 3) this.shapes.push(this.current);
      this.current = null; this.render();
    }
    this.drag = null;
  }
  setScene(shapes) { this.shapes = shapes; this.selected = null; this.render(); }
  render() {
    this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    this.shapes.forEach(s => s.draw(this.ctx));
    if (this.current) this.current.draw(this.ctx);
    if (this.selected) this.selected.outline(this.ctx);
  }
}