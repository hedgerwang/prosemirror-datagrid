export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(val: Vector): boolean {
    return val.x === this.x && val.y === this.y;
  }

  toString() {
    return `Vector(${this.x}, ${this.y})`;
  }
}
