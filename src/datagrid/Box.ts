import Vector from './Vector';

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

  clone(): Box {
    return new Box(this.x, this.y, this.w, this.h);
  }

  equals(box: Box): boolean {
    return (
      box === this ||
      (this.x === box.x &&
        this.y === box.y &&
        this.w === box.w &&
        this.h === box.h)
    );
  }

  intersects(box: Box): boolean {
    return !(
      this.x > box.x + box.w ||
      this.x + this.w < box.x ||
      this.y + this.h < box.y ||
      this.y > box.y + box.h
    );
  }

  contains(box: Box): boolean {
    return (
      this.x <= box.x &&
      this.x + this.w >= box.x &&
      this.y <= box.y &&
      this.y + this.h >= box.y &&
      this.w >= box.w &&
      this.h >= box.h
    );
  }

  isCorssBoundaryOf(box: Box): boolean {
    return box.intersects(this) && !box.contains(this);
  }

  isInsideAtBoundaryOf(box: Box): boolean {
    return (
      (this.x === box.x ||
        this.y === box.y ||
        this.x + this.w === box.x + box.w ||
        this.y + this.h === box.y + box.h) &&
      box.contains(this)
    );
  }

  isInsideOf(box: Box): boolean {
    return box.contains(this);
  }

  isOutsideOf(box: Box): boolean {
    return !box.contains(this);
  }

  getCenter(): Vector {
    return new Vector(this.x + this.w / 2, this.y + this.h / 2);
  }

  moveBy(x: number, y: number): Box {
    if (x === 0 && y === 0) {
      return this;
    }
    return new Box(this.x + x, this.y + y, this.w, this.h);
  }

  toString() {
    return `Box(x:${this.x}, y:${this.y}, w:${this.w}, h:${this.h})`;
  }
}
