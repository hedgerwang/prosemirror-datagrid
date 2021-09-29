import type { CanvasDataGridState } from './canvasDataGridState';
import getCellEntryKey from './getCellEntryKey';
import getIndexRowCellText from './getIndexRowCellText';

export default function getCellEntryContent(
  state: CanvasDataGridState,
  colIndex: number,
  rowIndex: number,
): string {
  const key = getCellEntryKey(colIndex, rowIndex);
  const content = state.proseMirror.node.attrs.entries[key];
  if (colIndex === 0) {
    return rowIndex === 0 ? '' : String(rowIndex);
  }
  if (rowIndex === 0) {
    return colIndex === 0 ? '' : getIndexRowCellText(colIndex);
  }
  return content === undefined ? `${colIndex}, ${rowIndex}` : content;
}
