export default function getCellEntryKey(
  colIndex: number,
  rowIndex: number,
): string {
  return `c_${colIndex}_${rowIndex}`;
}
