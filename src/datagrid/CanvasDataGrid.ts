import Box from './Box';
import DOMEventsHandler from './DOMEventsHandler';
import Vector from './Vector';
import clamp from './clamp';
import findCellAtPoint from './findCellAtPoint';
import renderCanvasDataGrid from './renderCanvasDataGrid';

import { toDOMAttributes } from './DataGridNodeSpec';
import CellSelection from './CellSelection';
import type {
  CanvasDataGridState,
  ProsemirrorProps,
} from './canvasDataGridState';
import type { ReducerDispatch } from './canvasDataGridReducer';
import reducer from './canvasDataGridReducer';
import type { CanvasDataGridAction } from './canvasDataGridActions';
import createCanvasDataGridState from './createCanvasDataGridState';
import { TextSelection } from 'prosemirror-state';
import {
  setActive,
  openCellEditor,
  setSelection,
  setCanvasBox,
} from './canvasDataGridActions';

const A_Z_KEY = /^[a-zA-Z0-9]$/;

function focusElement(el: Element, delay?: number) {
  if (el instanceof HTMLElement) {
    if (delay) {
      setTimeout(() => {
        el.focus();
      }, delay || 0);
    } else {
      el.focus();
    }
  }
}

function renderDOM(state: CanvasDataGridState) {
  const { proseMirror, dom, active } = state;
  const { node } = proseMirror;
  const el: any = dom;

  if (active !== el.__active) {
    el.__active = active;
    dom.setAttribute('data-active', String(active));
  }

  if (el.__proseMirrorNode === node) {
    return;
  }

  el.__proseMirrorNode = node;
  const domAttrs = toDOMAttributes(node);
  Object.keys(domAttrs).forEach((name) => {
    if (name === 'className') {
      dom[name] = domAttrs[name];
    } else {
      dom.setAttribute(name, domAttrs[name]);
    }
  });
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
  domEventsHandler.onKeyDown(dom, datagrid.onKeyDown, true);
  domEventsHandler.onFocusIn(dom, datagrid.onFocusChange, true);
  domEventsHandler.onFocusOut(dom, datagrid.onFocusChange, true);
  return domEventsHandler;
}

function shouldHandleEvent(e: Event, state: CanvasDataGridState) {
  const { dom, canvas, isEditingCell } = state;
  const { target } = e;
  return !isEditingCell || dom === target || canvas === target;
}

function onFocusChange(
  e: Event,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  const { dom } = state;
  const { activeElement } = document;
  const active = activeElement
    ? activeElement === dom || dom.contains(activeElement)
    : false;
  dispatch(setActive(active));
}

function onKeyDown(
  e: KeyboardEvent,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  if (!shouldHandleEvent(e, state)) {
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    // reload / redu / undo...etc.
    return;
  }

  e.preventDefault();

  const { proseMirror, selection, maxColIndex, maxRowIndex } = state;
  const { getPos, view } = proseMirror;
  const { key, ctrlKey, metaKey } = e;

  if (key === 'Escape') {
    const pos = typeof getPos === 'function' ? getPos() : 0;
    if (pos > 0) {
      const delta = e.shiftKey ? -1 : 1;
      const selection = TextSelection.create(view.state.doc, pos + delta);
      const tr = view.state.tr.setSelection(selection);
      focusElement(view.dom);
      view.dispatch(tr);
    }
    return;
  }

  if (key === 'ArrowLeft') {
    const { pos } = selection;
    const x = pos.x - 1;
    if (x > 0) {
      dispatch(setSelection(CellSelection.create(x, pos.y)));
    }
    return;
  }

  if (key === 'ArrowRight') {
    const { pos } = selection;
    const x = pos.x + 1;
    if (x <= maxColIndex) {
      dispatch(setSelection(CellSelection.create(x, pos.y)));
    }
    return;
  }

  if (key === 'ArrowDown') {
    const { pos } = selection;
    const y = pos.y + 1;
    if (y <= maxRowIndex) {
      dispatch(setSelection(CellSelection.create(pos.x, y)));
    }
    return;
  }

  if (key === 'ArrowUp') {
    const { pos } = selection;
    const y = pos.y - 1;
    if (y > 0) {
      dispatch(setSelection(CellSelection.create(pos.x, y)));
    }
    return;
  }

  if (key === 'Tab') {
    const { pos } = selection;
    const delta = e.shiftKey ? -1 : 1;
    let x = pos.x + delta;
    let y = pos.y;
    if (x > maxColIndex) {
      x = 1;
      y += 1;
    }
    if (x < 1) {
      x = maxColIndex;
      y -= 1;
    }

    if (y >= 1 && y <= maxRowIndex) {
      dispatch(setSelection(CellSelection.create(x, y)));
    }

    return;
  }

  if (key === 'Enter' || (A_Z_KEY.test(key) && !ctrlKey && !metaKey)) {
    dispatch(openCellEditor());
    return;
  }
}

function onMouseDown(
  e: MouseEvent,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  if (!shouldHandleEvent(e, state)) {
    return;
  }

  const { selection, isEditingCell } = state;
  const { offsetX, offsetY } = e;
  e.preventDefault();

  if (isEditingCell) {
    return;
  }

  const cell = findCellAtPoint(state, new Vector(offsetX, offsetY));
  if (cell) {
    const { x, y } = cell;
    let nextSelection;
    if (x === 0 && y === 0) {
      // top-left corner.
    } else if (y > 0 && x === 0) {
      // row selection.
    } else if (x > 0 && y === 0) {
      //
    } else {
      nextSelection = new CellSelection(cell);
    }
    if (!nextSelection) {
      return;
    }
    if (nextSelection.equals(selection)) {
      dispatch(openCellEditor());
    } else {
      dispatch(setSelection(nextSelection));
    }
  }
}

function onWheel(
  e: WheelEvent,
  state: CanvasDataGridState,
  dispatch: ReducerDispatch,
) {
  if (!shouldHandleEvent(e, state)) {
    return;
  }

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
    dispatch(setCanvasBox(canvasBox));
  }
}

export default class CanvasDataGrid {
  // Public.
  state: CanvasDataGridState;

  // Members.
  domEventsHandler: DOMEventsHandler;

  constructor(proseMirror: ProsemirrorProps) {
    this.state = createCanvasDataGridState({ proseMirror });
    this.domEventsHandler = createDOMEventsHandler(this.state.dom, this);
    this._render();
  }

  dispatch = (action: CanvasDataGridAction) => {
    const nextState = reducer(action, this.state);
    if (!nextState) {
      return;
    }

    const { tr, proseMirror } = nextState;
    if (tr) {
      nextState.tr = null;
    }
    this.state = nextState;
    requestAnimationFrame(this._render);
    tr && proseMirror.view.dispatch(tr);
  };

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

  onKeyDown = (e: KeyboardEvent) => {
    onKeyDown(e, this.state, this.dispatch);
  };

  onFocusChange = (e: Event) => {
    onFocusChange(e, this.state, this.dispatch);
  };

  _render = () => {
    const { state } = this;
    renderDOM(state);
    renderCellEditor(state, this.dispatch);
    renderCanvasDataGrid(state);
  };
}
