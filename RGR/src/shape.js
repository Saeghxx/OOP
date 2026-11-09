export class Shape {
  constructor(x1, y1, x2, y2, fill = "#ffffff") {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; this.fill = fill;
  }
  get type() { return this.constructor.name; }
  box() {
    return { x: Math.min(this.x1, this.x2), y: Math.min(this.y1, this.y2),
             w: Math.abs(this.x2 - this.x1), h: Math.abs(this.y2 - this.y1) };
  }
  draw(ctx) { throw new Error("draw() не реалізовано"); }
  style(ctx) { ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5; ctx.fillStyle = this.fill; }
  hit(px, py) {
    const b = this.box(), t = 5;
    return px >= b.x - t && px <= b.x + b.w + t && py >= b.y - t && py <= b.y + b.h + t;
  }
  move(dx, dy) { this.x1 += dx; this.x2 += dx; this.y1 += dy; this.y2 += dy; }
  outline(ctx) {
    const b = this.box();
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = "#2a6fd6";
    ctx.strokeRect(b.x - 3, b.y - 3, b.w + 6, b.h + 6); ctx.restore();
  }
  serialize() { return [this.type, this.x1, this.y1, this.x2, this.y2, this.fill].join(" "); }
}

export class Line extends Shape {
  draw(ctx) {
    this.style(ctx); ctx.beginPath();
    ctx.moveTo(this.x1, this.y1); ctx.lineTo(this.x2, this.y2); ctx.stroke();
  }
}

export class Arrow extends Line {
  draw(ctx) {
    super.draw(ctx);
    const a = Math.atan2(this.y2 - this.y1, this.x2 - this.x1), s = 12;
    ctx.beginPath(); ctx.moveTo(this.x2, this.y2);
    ctx.lineTo(this.x2 - s * Math.cos(a - 0.4), this.y2 - s * Math.sin(a - 0.4));
    ctx.lineTo(this.x2 - s * Math.cos(a + 0.4), this.y2 - s * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fillStyle = "#000"; ctx.fill();
  }
}

export class Rect extends Shape {
  draw(ctx) {
    const b = this.box(); this.style(ctx);
    ctx.fillRect(b.x, b.y, b.w, b.h); ctx.strokeRect(b.x, b.y, b.w, b.h);
  }
}

export class Ellipse extends Shape {
  draw(ctx) {
    const b = this.box(); this.style(ctx); ctx.beginPath();
    ctx.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2, 0, 0, 2 * Math.PI);
    ctx.fill(); ctx.stroke();
  }
}

export class Rhombus extends Shape {
  draw(ctx) {
    const b = this.box(); this.style(ctx); ctx.beginPath();
    ctx.moveTo(b.x + b.w / 2, b.y); ctx.lineTo(b.x + b.w, b.y + b.h / 2);
    ctx.lineTo(b.x + b.w / 2, b.y + b.h); ctx.lineTo(b.x, b.y + b.h / 2);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

export class Cube extends Shape {
  draw(ctx) {
    const b = this.box(), d = Math.min(b.w, b.h) * 0.3; this.style(ctx);
    const fx = b.x, fy = b.y + d, fw = b.w - d, fh = b.h - d;
    ctx.fillRect(fx, fy, fw, fh); ctx.strokeRect(fx, fy, fw, fh);
    ctx.beginPath(); // верхня грань
    ctx.moveTo(fx, fy); ctx.lineTo(fx + d, b.y); ctx.lineTo(b.x + b.w, b.y);
    ctx.lineTo(fx + fw, fy); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); // права грань
    ctx.moveTo(fx + fw, fy); ctx.lineTo(b.x + b.w, b.y);
    ctx.lineTo(b.x + b.w, b.y + fh); ctx.lineTo(fx + fw, fy + fh);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
}

export class Cylinder extends Shape {
  draw(ctx) {
    const b = this.box(), ry = Math.min(b.h / 2, b.w * 0.15); this.style(ctx);
    const cx = b.x + b.w / 2, rx = b.w / 2;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + ry); ctx.lineTo(b.x, b.y + b.h - ry);
    ctx.ellipse(cx, b.y + b.h - ry, rx, ry, 0, Math.PI, 0, true);
    ctx.lineTo(b.x + b.w, b.y + ry);
    ctx.ellipse(cx, b.y + ry, rx, ry, 0, 0, Math.PI, true);
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, b.y + ry, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
  }
}

export class TextShape extends Shape {
  constructor(x1, y1, text = "Текст") {
    super(x1, y1, x1, y1, "#000000"); this.text = text; this.size = 20;
  }
  box() {
    const w = this.text.length * this.size * 0.55;
    return { x: this.x1, y: this.y1, w, h: this.size };
  }
  draw(ctx) {
    ctx.fillStyle = this.fill; ctx.font = this.size + "px Arial"; ctx.textBaseline = "top";
    ctx.fillText(this.text, this.x1, this.y1);
  }
  serialize() { return ["TextShape", this.x1, this.y1, this.fill, this.text].join(" "); }
}

export class ShapeFactory {
  static classes = { Line, Arrow, Rect, Ellipse, Rhombus, Cube, Cylinder, TextShape };
  static create(type, x1, y1, x2, y2, fill) {
    return new ShapeFactory.classes[type](x1, y1, x2, y2, fill);
  }
  static parse(line) {
    const p = line.trim().split(" ");
    if (p[0] === "TextShape") {
      const t = new TextShape(+p[1], +p[2], p.slice(4).join(" ")); t.fill = p[3]; return t;
    }
    if (!ShapeFactory.classes[p[0]]) throw new Error("Невідомий тип: " + p[0]);
    return ShapeFactory.create(p[0], +p[1], +p[2], +p[3], +p[4], p[5]);
  }
}