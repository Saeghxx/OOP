# РГР №4. Векторний графічний редактор

Дисципліна: «Об'єктно-орієнтоване програмування».
Мова: JavaScript (ES6), HTML5 Canvas.

## Запуск

1. Відкрити папку проєкту у VS Code.
2. Встановити розширення **Live Server** і натиснути **Go Live** на `index.html`.
3. Або в терміналі: `npm start` (потрібен Node.js).

> Відкриття `index.html` подвійним кліком не працює: браузер блокує ES-модулі з `file://`.

## Структура проєкту

```
RGR/
├── index.html
├── package.json
├── README.md
└── src/
    ├── shape.js
    ├── viewer.js
    ├── toolbar.js
    ├── files.js
    └── main.js
```

## Діаграма модулів (import-ієрархія)

```mermaid
flowchart TD
    HTML["index.html"] -->|script type=module| MAIN["main.js"]
    MAIN --> VIEWER["viewer.js"]
    MAIN --> TOOLBAR["toolbar.js"]
    MAIN --> FILES["files.js"]
    VIEWER -->|ShapeFactory, TextShape| SHAPE["shape.js"]
    FILES -->|ShapeFactory| SHAPE
```

Текстовий вигляд:

```
index.html
└── main.js
    ├── viewer.js
    │   └── shape.js
    ├── toolbar.js
    └── files.js
        └── shape.js
```

## Діаграма класів

```mermaid
classDiagram
    class Shape {
        +x1
        +y1
        +x2
        +y2
        +fill
        +box()
        +draw(ctx)
        +hit(x, y)
        +move(dx, dy)
        +outline(ctx)
        +serialize()
    }
    class Line
    class Arrow
    class Rect
    class Ellipse
    class Rhombus
    class Cube
    class Cylinder
    class TextShape {
        +text
        +size
    }
    class ShapeFactory {
        +create(type, x1, y1, x2, y2, fill)$
        +parse(line)$
    }
    class Viewer {
        +shapes
        +tool
        +current
        +selected
        +render()
        +setScene(shapes)
    }
    class Toolbar {
        +buttons
        +select(name)
    }
    class Files {
        +name
        +newScene()
        +open()
        +load()
        +save()
        +saveAs()
    }

    Shape <|-- Line
    Line <|-- Arrow
    Shape <|-- Rect
    Shape <|-- Ellipse
    Shape <|-- Rhombus
    Shape <|-- Cube
    Shape <|-- Cylinder
    Shape <|-- TextShape

    ShapeFactory ..> Shape : створює
    Viewer o-- Shape : містить сцену
    Viewer ..> ShapeFactory : використовує
    Toolbar --> Viewer : задає інструмент
    Files --> Viewer : читає і записує сцену
    Files ..> ShapeFactory : розбирає файл
```

Зв'язки: `<|--` — успадкування, `o--` — агрегація, `-->` — асоціація, `..>` — залежність.

## Опис модулів

| Модуль | Призначення | Основні класи |
|---|---|---|
| `shape.js` | Елементи-форми | `Shape`, `Line`, `Arrow`, `Rect`, `Ellipse`, `Rhombus`, `Cube`, `Cylinder`, `TextShape`, `ShapeFactory` |
| `viewer.js` | Відображення сцени, обробка миші | `Viewer` |
| `toolbar.js` | Панель інструментів з підказками | `Toolbar` |
| `files.js` | Запис і читання файлів сцен | `Files` |
| `main.js` | Ініціалізація та меню «Файл» | — |

## Формат файлу сцени

Текстовий: один рядок — одна фігура.

```
Rect 50 40 200 160 #ffc000
Ellipse 250 60 400 140 #c6efce
TextShape 60 200 #000000 Привіт
```

Формат рядка: `Тип x1 y1 x2 y2 колір`. Для тексту: `TextShape x y колір текст`.