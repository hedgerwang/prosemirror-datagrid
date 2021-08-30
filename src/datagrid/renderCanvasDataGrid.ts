import CanvasDataGridStyle from './CanvasDataGridStyle';
import CanvasDataGridSetting from './CanvasDataGridSetting';
import CanvasDataGridRenderingContext from './CanvasDataGridRenderingContext';
import Box from './Box';
import nullthrows from 'nullthrows';
import SegmentList from './SegmentList';

export default function renderCanvasDataGrid(
  canvas: HTMLCanvasElement,
  canvasBox: Box,
  style: CanvasDataGridStyle,
  setting: CanvasDataGridSetting,
  rowsLayout: SegmentList,
  colsLayout: SegmentList,
) {
  const { fixedColsCount, fixedRowsCount } = setting;

  const {
    shadowBlur,
    shadowColor,
    fixedColBGColor,
    fixedRowBGColor,
    textColor,
  } = style;

  const dpi = window.devicePixelRatio;

  // Canvas.
  canvas.width = canvasBox.w * dpi;
  canvas.height = canvasBox.h * dpi;
  canvas.style.width = canvasBox.w + 'px';
  canvas.style.height = canvasBox.h + 'px';

  const ctx = new CanvasDataGridRenderingContext(
    nullthrows(canvas.getContext('2d')),
    dpi,
    style,
  );

  ctx.clearRect(0, 0, canvasBox.w, canvasBox.h);
  ctx.strokeStyle = 'solid';
  ctx.lineWidth = 1;
  ctx.beginPath();

  const { w, h } = canvasBox;
  const { x, y } = canvasBox;

  const rows = rowsLayout.view(y, y + h);
  const cols = colsLayout.view(x, x + w);

  // Non-Fixed Cells.
  rows.forEach((row) => {
    const hh = row.to - row.from;
    const fromY = row.from - y;
    const toY = fromY + hh;
    cols.forEach((col) => {
      const rr = row.index;
      const cc = col.index;
      if (rr < fixedRowsCount || cc < fixedColsCount) {
        return;
      }
      const ww = col.to - col.from;
      const fromX = col.from - x;
      const toX = fromX + ww;

      ctx.moveTo(fromX, toY);
      ctx.lineTo(toX, toY);
      ctx.moveTo(toX, fromY);
      ctx.lineTo(toX, toY);
      const text = `${rr}, ${cc}`;
      renderCellText(ctx, style, text, fromX, fromY, ww, hh);
    });
  });
  ctx.closePath();
  ctx.stroke();

  // Fixed Col Cells.
  if (x > 0 && fixedColsCount > 0) {
    const lastCol = colsLayout.peekAt(fixedColsCount - 1);
    ctx.clearRect(0, 0, lastCol.to, canvasBox.h);
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = fixedColBGColor;
    ctx.fillRect(0, 0, lastCol.to, canvasBox.h);
    ctx.shadowBlur = 0;
  }

  for (let cc = 0; cc < fixedColsCount; cc++) {
    const col = colsLayout.peekAt(cc);
    ctx.clearRect(col.from, 0, col.to - col.from, canvasBox.h);
    ctx.beginPath();
    rows.forEach((row) => {
      const rr = row.index;
      if (rr < fixedRowsCount) {
        return;
      }
      const hh = row.to - row.from;
      const cc = col.index;
      const fromX = col.from;
      const fromY = row.from - y;
      const toY = row.to - y;
      const toX = col.to;
      const ww = toX - fromX;

      ctx.fillStyle = fixedColBGColor;
      ctx.fillRect(fromX, fromY, ww, hh);

      ctx.moveTo(fromX, toY);
      ctx.lineTo(toX, toY);
      ctx.moveTo(toX, fromY);
      ctx.lineTo(toX, toY);
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      ctx.fillStyle = textColor;
      renderCellText(ctx, style, text, fromX, fromY, ww, hh);
    });
    ctx.closePath();
    ctx.stroke();
  }

  // Fixed Row Cells.
  if (y > 0 && fixedRowsCount > 0) {
    const lastRow = rowsLayout.peekAt(fixedRowsCount - 1);
    ctx.clearRect(0, 0, canvasBox.w, lastRow.to);
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.fillStyle = fixedColBGColor;
    ctx.fillRect(0, 0, canvasBox.w, lastRow.to);
    ctx.shadowBlur = 0;
  }

  for (let rr = 0; rr < fixedRowsCount; rr++) {
    const row = rowsLayout.peekAt(rr);
    const fromY = row.from;
    const toY = row.to;
    const hh = toY - fromY;
    ctx.clearRect(0, fromY, canvasBox.w, hh);
    ctx.beginPath();
    cols.forEach((col) => {
      const cc = col.index;
      if (cc < fixedColsCount) {
        return;
      }
      const fromX = col.from - x;
      const toX = col.to - x;
      const ww = toX - fromX;
      ctx.fillStyle = fixedRowBGColor;
      ctx.fillRect(fromX, fromY, ww, hh);

      ctx.moveTo(fromX, toY);
      ctx.lineTo(toX, toY);
      ctx.moveTo(toX, fromY);
      ctx.lineTo(toX, toY);
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      ctx.fillStyle = textColor;
      renderCellText(ctx, style, text, fromX, fromY, ww, hh);
    });
    ctx.closePath();
    ctx.stroke();
  }

  // Fixed Corner Cells.

  for (let rr = 0; rr < fixedRowsCount; rr++) {
    const row = rowsLayout.peekAt(rr);
    for (let cc = 0; cc < fixedColsCount; cc++) {
      const col = colsLayout.peekAt(cc);
      const fromX = col.from;
      const toX = col.to;
      const fromY = row.from;
      const toY = row.to;
      const ww = toX - fromX;
      const hh = toY - fromY;
      ctx.clearRect(fromX, fromY, ww, hh);

      ctx.fillStyle = fixedRowBGColor;
      ctx.fillRect(fromX, fromY, ww, hh);

      ctx.beginPath();
      ctx.moveTo(fromX, toY);
      ctx.lineTo(toX, toY);
      ctx.moveTo(toX, fromY);
      ctx.lineTo(toX, toY);
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      ctx.fillStyle = textColor;
      renderCellText(ctx, style, text, fromX, fromY, ww, hh);
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function renderCellText(
  ctx: CanvasDataGridRenderingContext,
  style: CanvasDataGridStyle,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const { cellPadding, textSize } = style;
  ctx.fillText(text, x + cellPadding, y + cellPadding + textSize);
}
