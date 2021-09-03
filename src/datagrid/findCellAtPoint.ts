import Box from './Box';
import SegmentList from './SegmentList';
import Vector from './Vector';
import CanvasDataGridConfig from './CanvasDataGridConfig';

export default function findCellAtPoint(
  config: CanvasDataGridConfig,
  canvasBox: Box,
  cols: SegmentList,
  rows: SegmentList,
  point: Vector,
): Vector | null {
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
    row = cols.point(point.y);
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
