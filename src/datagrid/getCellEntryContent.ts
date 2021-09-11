import type { CanvasDataGridState } from './canvasDataGridState';
import getCellEntryKey from './getCellEntryKey';

export default function getCellEntryContent(
  state: CanvasDataGridState,
  colIndex: number,
  rowIndex: number,
): string {
  const key = getCellEntryKey(colIndex, rowIndex);
  const content = state.proseMirror.node.attrs.entries[key];
  return content === undefined ? `${colIndex}, ${rowIndex}` : content;
}
