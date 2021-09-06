import Vector from './Vector';

export default class CellSelection {
  anchor: Vector;
  focus: Vector;

  constructor(anchor: Vector, focus?: Vector | null) {
    this.anchor = anchor;
    this.focus = focus || anchor;
  }

  equals(val: CellSelection): boolean {
    return val.anchor.equals(this.anchor) && val.focus.equals(this.focus);
  }
}
