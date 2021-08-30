import { Decoration } from 'prosemirror-view';
import { toDOMAttributes } from './DataGridNodeSpec';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import styles from './CanvasDataGrid.css';
import DOMEventsHandler from './DOMEventsHandler';
import clamp from './clamp';
import SegmentList from './SegmentList';
import Box from './Box';
import CanvasDataGridStyle from './CanvasDataGridStyle';
import CanvasDataGridSetting from './CanvasDataGridSetting';
import renderCanvasDataGrid from './renderCanvasDataGrid';

export type Props = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_COL_WIDTH = 120;

const KEYBOARD_NAV_KEYS = new Set([
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
]);

function updateDOMAttributes(dom: HTMLElement, node: ProsemirrorNode) {
  const domAttrs = toDOMAttributes(node);
  Object.keys(domAttrs).forEach((name) => {
    if (name === 'className') {
      dom[name] = domAttrs[name];
    } else {
      dom.setAttribute(name, domAttrs[name]);
    }
  });
}

export default class CanvasDataGrid {
  // Public.
  dom: HTMLDivElement;
  props: Props;

  // Members.
  _domEventsHandler: DOMEventsHandler;
  _canvas: HTMLCanvasElement;
  _canvasBox: Box;
  _rows: SegmentList;
  _cols: SegmentList;
  _style: CanvasDataGridStyle;
  _setting: CanvasDataGridSetting;

  constructor(props: Props) {
    this.props = props;

    this._setting = new CanvasDataGridSetting();
    this._style = new CanvasDataGridStyle();

    const dom = document.createElement('div');
    dom.tabIndex = 0;
    dom.className = styles.main;
    this.dom = dom;

    const domEventsHandler = new DOMEventsHandler();
    domEventsHandler.onWheel(dom, this._onWheel, true);
    domEventsHandler.onMouseDown(dom, this._onMouseDown, true);
    this._domEventsHandler = domEventsHandler;

    const canvasBox = new Box(0, 0, 760, 400);
    this._canvasBox = canvasBox;

    const canvas = document.createElement('canvas');
    canvas.className = styles.canvas;
    dom.appendChild(canvas);
    this._canvas = canvas;

    this._rows = new SegmentList(DEFAULT_ROW_HEIGHT);
    this._cols = new SegmentList(DEFAULT_COL_WIDTH);
    this._cols.setSize(0, this._setting.indexColumnWidth);
    // this._rows.setSize(0, 40);
    // this._rows.setSize(5, 200);
    this._renderCanvas();
  }

  render(props: Props) {
    updateDOMAttributes(this.dom, props.node);
  }

  select() {}

  unselect() {}

  focus() {
    this.dom.focus();
  }

  destroy() {
    this._domEventsHandler.destroy();
  }

  _onMouseDown = (e: MouseEvent) => {
    console.log(e);
    e.preventDefault();
    this.focus();
  };

  _onWheel = (e: WheelEvent) => {
    e.preventDefault();

    let canvasBox = this._canvasBox;
    const { deltaY, deltaX } = e;

    if (this._setting.snapToGrid) {
      const row = this._rows.view(canvasBox.y, canvasBox.y + 1)[0];
      if (row) {
        if (deltaY > 0) {
          // back
          const { x, w, h } = canvasBox;
          if (row.index > 0) {
            const nextRow = this._rows.peekAt(row.index - 1);
            const y = nextRow.to;
            canvasBox = new Box(x, y, w, h);
          } else {
            canvasBox = new Box(x, 0, w, h);
          }
        } else if (deltaY < 0) {
          // forward.
          const { x, w, h } = canvasBox;
          const nextRow = this._rows.peekAt(row.index + 1);
          const y = nextRow.to;
          canvasBox = new Box(x, y, w, h);
        }
      }
      const col = this._cols.view(canvasBox.x, canvasBox.x + 1)[0];
      if (col) {
        if (deltaX > 0) {
          // back
          const { y, w, h } = canvasBox;
          if (col.index > 0) {
            const nextCol = this._cols.peekAt(col.index - 1);
            const x = nextCol.from;
            canvasBox = new Box(x, y, w, h);
          } else {
            canvasBox = new Box(0, y, w, h);
          }
        } else if (deltaX < 0) {
          // forward.
          const { y, w, h } = canvasBox;
          const nextCol = this._cols.peekAt(col.index + 1);
          const x = nextCol.to;
          canvasBox = new Box(x, y, w, h);
        }
      }
    } else {
      const x = clamp(canvasBox.x - deltaX, 0, 10000);
      const y = clamp(canvasBox.y - deltaY, 0, 10000);
      canvasBox = new Box(x, y, canvasBox.w, canvasBox.h);
    }

    if (!canvasBox.equals(this._canvasBox)) {
      this._canvasBox = canvasBox;
      window.requestAnimationFrame(this._renderCanvas);
    }
  };

  _renderCanvas = () => {
    renderCanvasDataGrid(
      this._canvas,
      this._canvasBox,
      this._style,
      this._setting,
      this._rows,
      this._cols,
    );
  };
}
