import Vector from './Vector';
import Box from './Box';
import type { CanvasDataGridState } from './canvasDataGridState';

export default function findCellBox(
  state: CanvasDataGridState,
  cell: Vector,
): Box | null {
  const { rows, cols } = state;
  const row = rows.peekAt(cell.y);
  const col = cols.peekAt(cell.x);
  if (row && col) {
    return new Box(col.from, row.from, col.to - col.from, row.to - row.from);
  }
  return null;
}
