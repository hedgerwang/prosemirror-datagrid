export default class Vector {
  _x: number;
  _y: number;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  toString() {
    return `Vector(${this._x}, ${this._y})`;
  }
}
