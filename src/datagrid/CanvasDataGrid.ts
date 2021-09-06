import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import DOMEventsHandler from './DOMEventsHandler';
import SegmentList from './SegmentList';
import Vector from './Vector';
import clamp from './clamp';
import findCellAtPoint from './findCellAtPoint';
import renderCanvasDataGrid from './renderCanvasDataGrid';
import styles from './CanvasDataGrid.css';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import { toDOMAttributes } from './DataGridNodeSpec';
import CellSelection from './CellSelection';
import type {
  CanvasDataGridState,
  CanvasDataGridStateChange,
  ProsemirrorProps,
} from './CanvasDataGridState';
import type { ReducerAction } from './reducer';
import reducer from './reducer';
import { createState } from './CanvasDataGridState';

function renderDOM(state: CanvasDataGridState) {
  const { proseMirror, dom } = state;
  const { node } = proseMirror;
  const domAttrs = toDOMAttributes(node);
  Object.keys(domAttrs).forEach((name) => {
    if (name === 'className') {
      dom[name] = domAttrs[name];
    } else {
      dom.setAttribute(name, domAttrs[name]);
    }
  });
  dom.classList.add(styles.main);
}

function createDOMEventsHandler(
  dom: HTMLElement,
  datagrid: CanvasDataGrid,
): DOMEventsHandler {
  const domEventsHandler = new DOMEventsHandler();
  domEventsHandler.onWheel(dom, datagrid.onWheel, true);
  domEventsHandler.onMouseDown(dom, datagrid.onMouseDown, true);
  return domEventsHandler;
}

export default class CanvasDataGrid {
  // Public.
  state: CanvasDataGridState;

  // Members.
  domEventsHandler: DOMEventsHandler;

  constructor(proseMirror: ProsemirrorProps) {
    this.state = createState({ proseMirror });
    this.domEventsHandler = createDOMEventsHandler(this.state.dom, this);
    renderDOM(this.state);
    renderCanvasDataGrid(this.state);
  }

  dispatch(action: ReducerAction) {
    const nextState = reducer(action, this.state);
    if (nextState) {
      requestAnimationFrame(() => {
        if (action.type === 'setProseMirrorProps') {
          renderDOM(nextState);
        }
        renderCanvasDataGrid(nextState);
      });
    }
  }

  select() {}

  unselect() {}

  focus() {
    this.state.dom.focus();
  }

  destroy() {
    this.domEventsHandler.destroy();
  }

  onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    const { state } = this;
    const { offsetX, offsetY } = e;
    const anchor = findCellAtPoint(state, new Vector(offsetX, offsetY));
    if (anchor) {
      const selection = new CellSelection(anchor);
      if (!selection.equals(state.selection)) {
        this.dispatch({
          type: 'setSelection',
          selection,
        });
      }
    }
    this.focus();
  };

  onWheel = (e: WheelEvent) => {
    e.preventDefault();

    const { state } = this;
    const { config, rows, cols } = state;
    let { canvasBox } = state;
    const { deltaY, deltaX } = e;

    if (config.snapToGrid) {
      const row = rows.view(canvasBox.y, canvasBox.y + 1)[0];
      if (row) {
        if (deltaY > 0) {
          // back
          const { x, w, h } = canvasBox;
          if (row.index > 0) {
            const nextRow = rows.peekAt(row.index - 1);
            const y = nextRow.to;
            canvasBox = new Box(x, y, w, h);
          } else {
            canvasBox = new Box(x, 0, w, h);
          }
        } else if (deltaY < 0) {
          // forward.
          const { x, w, h } = canvasBox;
          const nextRow = rows.peekAt(row.index + 1);
          const y = nextRow.to;
          canvasBox = new Box(x, y, w, h);
        }
      }
      const col = cols.view(canvasBox.x, canvasBox.x + 1)[0];
      if (col) {
        if (deltaX > 0) {
          // back
          const { y, w, h } = canvasBox;
          if (col.index > 0) {
            const nextCol = cols.peekAt(col.index - 1);
            const x = nextCol.from;
            canvasBox = new Box(x, y, w, h);
          } else {
            canvasBox = new Box(0, y, w, h);
          }
        } else if (deltaX < 0) {
          // forward.
          const { y, w, h } = canvasBox;
          const nextCol = cols.peekAt(col.index + 1);
          const x = nextCol.to;
          canvasBox = new Box(x, y, w, h);
        }
      }
    } else {
      const x = clamp(canvasBox.x - deltaX, 0, 10000);
      const y = clamp(canvasBox.y - deltaY, 0, 10000);
      canvasBox = new Box(x, y, canvasBox.w, canvasBox.h);
    }

    if (!state.canvasBox.equals(canvasBox)) {
      this.dispatch({
        type: 'setCanvasBox',
        canvasBox,
      });
    }
  };
}
