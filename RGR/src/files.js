import { ShapeFactory } from "./shape.js";

export class Files {
  constructor(viewer) {
    this.viewer = viewer; this.name = "scene.txt";
    this.input = document.createElement("input");
    this.input.type = "file"; this.input.accept = ".txt";
    this.input.onchange = () => this.load();
  }
  newScene() { this.viewer.setScene([]); this.name = "scene.txt"; }
  open() { this.input.value = ""; this.input.click(); }   
  load() {
    const f = this.input.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const lines = r.result.split(/\r?\n/).filter(l => l.trim());
        const shapes = lines.map(l => ShapeFactory.parse(l));
        this.viewer.setScene(shapes); this.name = f.name;
      } catch (err) { alert("Помилка файлу: " + err.message); }
    };
    r.readAsText(f);
  }
  text() { return this.viewer.shapes.map(s => s.serialize()).join("\n"); }
  async saveAs() {                                         
    if (window.showSaveFilePicker) {
      try {
        const h = await showSaveFilePicker({ suggestedName: this.name,
          types: [{ description: "Текстовий файл", accept: { "text/plain": [".txt"] } }] });
        const w = await h.createWritable(); await w.write(this.text()); await w.close();
        this.name = h.name; return;
      } catch (e) { if (e.name === "AbortError") return; }
    }
    const n = prompt("Ім'я файлу:", this.name); if (n) { this.name = n; this.save(); }
  }
  save() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([this.text()], { type: "text/plain" }));
    a.download = this.name; a.click(); URL.revokeObjectURL(a.href);
  }
}