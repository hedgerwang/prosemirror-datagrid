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

  getAngleFrom(point: Vector): number {
    const dx = this.x - point.x;
    const dy = this.y - point.y;
    const val = (Math.atan2(dy, dx) * 180) / Math.PI;
    let deg;
    if (val >= -90 && val < 180) {
      deg = val + 90;
    } else {
      deg = 360 + +90 + val;
    }
    // 270 ~ 360 |  0 ~  90
    // ----------x----------
    // 180 ~ 280 | 90 ~ 180
    return Math.round(deg);
  }

  toString() {
    return `Vector(${this.x}, ${this.y})`;
  }
}
