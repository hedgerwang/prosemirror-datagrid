import Vector from './Vector';

export default function getCellAttrKey(cell: Vector): string {
  const { x, y } = cell;
  return `c_${x}_${y}`;
}
