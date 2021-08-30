import CanvasDataGridStyle from './CanvasDataGridStyle';

export default class DeviceRenderingContext {
  ctx: CanvasRenderingContext2D;
  dpi: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    dpi: number,
    style: CanvasDataGridStyle,
  ) {
    this.ctx = ctx;
    this.dpi = dpi;
    ctx.font = `${style.textSize * dpi}px Arial`;
  }

  set strokeStyle(val: string) {
    this.ctx.strokeStyle = val;
  }

  set lineWidth(val: number) {
    this.ctx.lineWidth = val;
  }

  set fillStyle(val: string) {
    this.ctx.fillStyle = val;
  }

  set shadowBlur(val: number) {
    this.ctx.shadowBlur = val;
  }

  set shadowColor(val: string) {
    this.ctx.shadowColor = val;
  }

  fillText(text: string, x: number, y: number, maxWidth?: number) {
    const { ctx, dpi } = this;
    if (typeof maxWidth === 'number') {
      ctx.fillText(text, x * dpi, y * dpi, maxWidth * dpi);
    } else {
      ctx.fillText(text, x * dpi, y * dpi);
    }
  }

  clearRect(x: number, y: number, w: number, h: number) {
    const { ctx, dpi } = this;
    ctx.clearRect(x * dpi, y * dpi, w * dpi, h * dpi);
  }

  fillRect(x: number, y: number, w: number, h: number) {
    const { ctx, dpi } = this;
    ctx.fillRect(x * dpi, y * dpi, w * dpi, h * dpi);
  }

  moveTo(x: number, y: number) {
    const { ctx, dpi } = this;
    ctx.moveTo(x * dpi, y * dpi);
  }

  lineTo(x: number, y: number) {
    const { ctx, dpi } = this;
    ctx.lineTo(x * dpi, y * dpi);
  }

  stroke() {
    this.ctx.stroke();
  }

  beginPath() {
    this.ctx.beginPath();
  }

  closePath() {
    this.ctx.closePath();
  }
}
