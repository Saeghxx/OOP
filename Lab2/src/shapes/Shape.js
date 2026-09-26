export class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error("Shape є абстрактним класом і не може бути створений напряму");
    }
  }

  Show(ctx) {
    throw new Error("Show() має бути перевизначений у похідному класі");
  }
}