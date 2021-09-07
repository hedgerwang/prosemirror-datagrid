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
import { toDOMAttributes } from './DataGridNodeSpec';
import CellSelection from './CellSelection';
import type {
  CanvasDataGridState,
  ProsemirrorProps,
} from './CanvasDataGridState';
import type { ReducerAction, ReducerDispatch } from './reducer';
import reducer from './reducer';
import createCanvasDataGridState from './createCanvasDataGridState';

function renderDOMAttributes(state: CanvasDataGridState) {
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

function renderCellEditor(
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  const { selection, rows, cols, cellEditor, isEditingCell, canvasBox } = state;
  const col = isEditingCell && cols.peekAt(selection.pos.x);
  const row = isEditingCell && rows.peekAt(selection.pos.y);
  if (!col || !row) {
    cellEditor.hide();
  } else {
    const { x, y } = canvasBox;
    cellEditor.show(state, dispatch, col.from - x, row.from - y);
    cellEditor.focus();
  }
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
    this.state = createCanvasDataGridState({ proseMirror });
    this.domEventsHandler = createDOMEventsHandler(this.state.dom, this);
    renderDOMAttributes(this.state);
    renderCanvasDataGrid(this.state);
  }

  dispatch = (action: ReducerAction) => {
    const nextState = reducer(action, this.state);
    if (!nextState) {
      return;
    }
    console.log(action);
    this.state = nextState;
    const { type } = action;
    requestAnimationFrame(() => {
      if (type === 'setProseMirrorProps') {
        renderDOMAttributes(nextState);
      }
      renderCellEditor(nextState, this.dispatch);
      renderCanvasDataGrid(nextState);
    });
  };

  select() {}

  unselect() {}

  focus() {
    this.state.dom.focus();
  }

  destroy() {
    this.domEventsHandler.destroy();
  }

  onMouseDown = (e: MouseEvent) => {
    const { target } = e;
    const { canvas, dom } = this.state;
    if (target === canvas || target === dom) {
      onMouseDown(e, this.state, this.dispatch);
      this.focus();
    }
  };

  onWheel = (e: WheelEvent) => {
    onWheel(e, this.state, this.dispatch);
  };
}

function onMouseDown(
  e: MouseEvent,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  e.preventDefault();
  const { offsetX, offsetY } = e;
  const { selection, isEditingCell } = state;
  if (isEditingCell) {
    dispatch({
      type: 'closeCellEditor',
    });
    return;
  }
  const cell = findCellAtPoint(state, new Vector(offsetX, offsetY));
  if (cell) {
    const nextSelection = new CellSelection(cell);
    console.log(nextSelection);
    if (nextSelection.equals(selection)) {
      dispatch({
        type: 'openCellEditor',
      });
    } else {
      dispatch({
        type: 'setSelection',
        selection: nextSelection,
      });
    }
  }
}

function onWheel(
  e: WheelEvent,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  e.preventDefault();

  const { config, rows, cols, isEditingCell } = state;
  let { canvasBox } = state;
  const { deltaY, deltaX } = e;

  if (isEditingCell) {
    return;
  }

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
    dispatch({
      type: 'setCanvasBox',
      canvasBox,
    });
  }
}
