import Vector from './Vector';
import CanvasDataGridState from './CanvasDataGridState';

export default function findCellAtPoint(
  state: CanvasDataGridState,
  point: Vector,
): Vector | null {
  const { config, canvasBox, cols, rows } = state;

  let col;

  let row;
  const { fixedColsCount, fixedRowsCount } = config;
  if (fixedColsCount) {
    col = cols.point(point.x);
    if (col && col.index > fixedColsCount - 1) {
      col = null;
    }
  }

  if (fixedRowsCount) {
    row = rows.point(point.y);
    if (row && row.index > fixedRowsCount - 1) {
      row = null;
    }
  }

  if (!col) {
    col = cols.point(point.x + canvasBox.x);
  }

  if (!row) {
    row = rows.point(point.y + canvasBox.y);
  }

  if (!col || !row) {
    return null;
  }
  return new Vector(col.index, row.index);
}
