import Vector from './Vector';

export default class CellSelection {
  pos: Vector;

  static create(colIndex: number, rowIndex: number): CellSelection {
    return new CellSelection(new Vector(colIndex, rowIndex));
  }

  constructor(cell: Vector) {
    this.pos = cell;
  }

  equals(val: CellSelection): boolean {
    return val.pos.equals(this.pos);
  }
}
