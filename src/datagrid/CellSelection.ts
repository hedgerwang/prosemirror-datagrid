import Vector from './Vector';

export default class CellSelection {
  pos: Vector;

  constructor(anchor: Vector) {
    this.pos = anchor;
  }

  equals(val: CellSelection): boolean {
    return val.pos.equals(this.pos);
  }
}
