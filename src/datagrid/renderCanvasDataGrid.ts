import CanvasDataGridRenderingContext from './CanvasDataGridRenderingContext';
import Box from './Box';
import nullthrows from 'nullthrows';
import SegmentList from './SegmentList';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import CanvasDataGridSelection from './CanvasDataGridSelection';

type CellStyle = {
  bgColor?: string | null;
  borderColor?: string | null;
};

function setCanvasSize(
  canvas: HTMLCanvasElement,
  canvasBox: Box,
  ctx: CanvasDataGridRenderingContext,
) {
  const { dpi } = ctx;
  canvas.width = canvasBox.w * dpi;
  canvas.height = canvasBox.h * dpi;
  canvas.style.width = canvasBox.w + 'px';
  canvas.style.height = canvasBox.h + 'px';
}

function renderCell(
  ctx: CanvasDataGridRenderingContext,
  config: CanvasDataGridConfig,
  cellBox: Box,
  text: string | null,
  style?: CellStyle,
) {
  const {
    cellPadding,
    textSize,
    textColor,
    fontType,
    cellBGColor,
    cellBorderColor,
  } = config;

  const bgColor = style?.bgColor || cellBGColor;
  const borderColor = style?.borderColor || cellBorderColor;

  const { x, y, w, h } = cellBox;
  // background.
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, w, h);

  // border.
  ctx.lineWidth = 1;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(x, y, w, h);

  if (text) {
    ctx.fillStyle = textColor;
    ctx.font = `${textSize}px ${fontType}`;
    ctx.fillText(text, x + cellPadding, y + cellPadding + textSize);
  }
}

function renderFixedShadow(
  ctx: CanvasDataGridRenderingContext,
  config: CanvasDataGridConfig,
  shadowBox: Box,
) {
  const { shadowBlur, shadowColor, cellBGColor } = config;
  const { x, y, w, h } = shadowBox;
  ctx.clearRect(x, y, w, h);
  ctx.shadowBlur = shadowBlur;
  ctx.shadowColor = shadowColor;
  ctx.fillStyle = cellBGColor;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;
}

export default function renderCanvasDataGrid(
  canvas: HTMLCanvasElement,
  canvasBox: Box,
  config: CanvasDataGridConfig,
  rowsLayout: SegmentList,
  colsLayout: SegmentList,
  selection: CanvasDataGridSelection,
  fps: number,
) {
  const {
    cellBGColor,
    cellBorderColor,
    fixedColBGColor,
    fixedColsCount,
    fixedRowBGColor,
    fixedRowsCount,
    selectionBGColor,
    selectionBorderColor,
    shadowBlur,
    shadowColor,
    textColor,
  } = config;

  const anchorCol = selection.anchor.x;
  const anchorRow = selection.anchor.y;
  let anchorRect: Box | null = null;

  const ctx = new CanvasDataGridRenderingContext(
    nullthrows(nullthrows(canvas.getContext('2d'))),
    config,
  );

  setCanvasSize(canvas, canvasBox, ctx);

  ctx.clearRect(0, 0, canvasBox.w, canvasBox.h);
  ctx.strokeStyle = cellBorderColor;
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

      // selected cell background.
      const selected = anchorCol === cc && anchorRow === rr;
      if (selected) {
        anchorRect = new Box(fromX, fromY, ww, hh);
        renderCell(ctx, config, anchorRect, null, {
          bgColor: selectionBGColor,
        });
      }

      const text = `${selected} ${rr}, ${cc}`;
      renderCell(ctx, config, new Box(fromX, fromY, ww, hh), text);
    });
  });
  ctx.closePath();
  ctx.stroke();

  // Anchor Selection Border for non-fixed cells.
  if (anchorRect) {
    const { x, y, w, h } = anchorRect;
    ctx.lineWidth = 2;
    ctx.strokeStyle = selectionBorderColor;
    ctx.strokeRect(x, y, w, h);
  }

  // Fixed col cells drop-shadow.
  if (x > 0 && fixedColsCount > 0) {
    const lastCol = colsLayout.peekAt(fixedColsCount - 1);
    renderFixedShadow(ctx, config, new Box(0, 0, lastCol.to, canvasBox.h));
  }

  // Fixed col cells.
  const fixedColStyle = {
    bgColor: fixedColBGColor,
  };
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
      const toX = col.to;
      const ww = toX - fromX;
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      renderCell(
        ctx,
        config,
        new Box(fromX, fromY, ww, hh),
        text,
        fixedColStyle,
      );
    });
    ctx.closePath();
    ctx.stroke();
  }

  // Fixed row cells drop-shadow.
  if (y > 0 && fixedRowsCount > 0) {
    const lastRow = rowsLayout.peekAt(fixedRowsCount - 1);
    renderFixedShadow(ctx, config, new Box(0, 0, canvasBox.w, lastRow.to));
  }

  // Fixed row cell.
  const fixedRowCellStyle = {
    bgColor: fixedRowBGColor,
  };
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
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      renderCell(
        ctx,
        config,
        new Box(fromX, fromY, ww, hh),
        text,
        fixedRowCellStyle,
      );
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
      const text = cc === 0 ? `${rr}` : `${rr}, ${cc}`;
      renderCell(
        ctx,
        config,
        new Box(fromX, fromY, ww, hh),
        text,
        fixedRowCellStyle,
      );
    }
  }

  // DEV
  const { devMode } = config;
  if (devMode) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    const devBox = new Box(canvasBox.w - 60, canvasBox.h - 25, 60, 25);
    ctx.fillRect(devBox.x, devBox.y, devBox.w, devBox.h);
    const text = `fps = ${fps | 0}`;
    ctx.fillStyle = '#fff';
    ctx.fillText(text, devBox.x + 8, devBox.y + 16);
  }
}
