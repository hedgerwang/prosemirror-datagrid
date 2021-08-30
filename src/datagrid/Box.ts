export default class Box {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  equals(box: Box): boolean {
    return (
      this.x === box.x &&
      this.y === box.y &&
      this.w === box.w &&
      this.h === box.h
    );
  }

  toString() {
    return `Box(x:${this.x}, y:${this.y}, w:${this.w}, h:${this.h})`;
  }
}
