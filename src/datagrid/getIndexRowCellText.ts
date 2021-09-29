const cachedResult = new Map();

function numToAZ(num: number): string {
  return num <= 26
    ? String.fromCharCode(num + 64)
    : numToAZ(~~((num - 1) / 26)) + numToAZ(num % 26 || 26);
}

export default function getIndexRowCellText(colIndex: number): string {
  if (cachedResult.has(colIndex)) {
    return cachedResult.get(colIndex);
  }
  const result = numToAZ(colIndex);
  cachedResult.set(colIndex, result);
  return result;
}
