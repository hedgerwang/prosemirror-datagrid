import CanvasDataGridConfig from './CanvasDataGridConfig';
import nullthrows from 'nullthrows';
import Box from './Box';

// "12px Arial"
const RE_FONT_VALUE = /^(\d+)px\s([A-ZA-z\s]+)$/;

export default class DeviceRenderingContext {
  ctx: CanvasRenderingContext2D;
  dpi: number;

  constructor(ctx: CanvasRenderingContext2D, config: CanvasDataGridConfig) {
    const dpi = window.devicePixelRatio;
    this.ctx = ctx;
    this.dpi = dpi;
  }

  set font(val: string) {
    const matches = val.match(RE_FONT_VALUE);
    if (!matches) {
      throw new Error(`unsupport font. expect "12px Arial"`);
    }
    const { dpi } = this;
    const fontSize = parseInt(matches[1], 10);
    const fontType = matches[2];
    const font = `${fontSize * dpi}px ${fontType}`;
    this.ctx.font = font;
  }

  set strokeStyle(val: string) {
    this.ctx.strokeStyle = val;
  }

  // Lines can be drawn with the stroke(), strokeRect(), and strokeText()
  // methods.
  set lineWidth(val: number) {
    this.ctx.lineWidth = val * this.dpi;
  }

  set fillStyle(val: string) {
    this.ctx.fillStyle = val;
  }

  set shadowBlur(val: number) {
    this.ctx.shadowBlur = val * this.dpi;
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

  strokeRect(x: number, y: number, w: number, h: number) {
    const { ctx, dpi } = this;
    ctx.strokeRect(x * dpi, y * dpi, w * dpi, h * dpi);
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
