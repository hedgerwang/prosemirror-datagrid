import type {
  CanvasDataGridState,
  CanvasDataGridStateChange,
} from './canvasDataGridState';
import findCellBox from './findCellBox';
import type {
  CanvasDataGridAction,
  CloseCellEditorAction,
  OpenCellEditorAction,
  SetActiveAction,
  SetCanvasBoxAction,
  SetProseMirrorPropsAction,
  SetSelectionAction,
} from './canvasDataGridActions';
import setCellEntryContent from './setCellEntryContent';
import Box from './Box';

export type ReducerDispatch = (action: CanvasDataGridAction) => void;

function getFixedRowsHeight(state: CanvasDataGridState): number {
  const { config, rows } = state;
  const row = rows.peekAt(config.fixedRowsCount - 1);
  return row.to;
}

function getFixedColsWidth(state: CanvasDataGridState): number {
  const { config, cols } = state;
  const row = cols.peekAt(config.fixedColsCount - 1);
  return row.to;
}

function setSelection(
  action: SetSelectionAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  const { canvasBox } = state;
  const { selection } = action;
  const cellBox = findCellBox(state, selection.pos);
  let newCanvasBox = canvasBox;

  if (cellBox) {
    const cw = getFixedColsWidth(state);
    const rh = getFixedRowsHeight(state);
    const viewpotBox = new Box(
      newCanvasBox.x + cw,
      newCanvasBox.y + rh,
      newCanvasBox.w - cw,
      newCanvasBox.h - rh,
    );
    let dx = 0;
    let dy = 0;
    if (cellBox.x < viewpotBox.x) {
      dx = -(viewpotBox.x - cellBox.x);
    }

    if (cellBox.x + cellBox.w > viewpotBox.x + viewpotBox.w) {
      dx = cellBox.x + cellBox.w - viewpotBox.x - viewpotBox.w;
    }
    if (cellBox.y <= viewpotBox.y) {
      dy = -(viewpotBox.y - cellBox.y, cellBox.h);
    }
    if (cellBox.y + cellBox.h >= viewpotBox.y + viewpotBox.h) {
      dy = cellBox.y + cellBox.h - viewpotBox.y - viewpotBox.h;
    }
    newCanvasBox = newCanvasBox.moveBy(dx, dy);
  }

  const { x, y } = newCanvasBox;
  newCanvasBox = newCanvasBox.moveBy(x < 0 ? -x : 0, y < 0 ? -y : 0);

  if (!newCanvasBox.equals(canvasBox)) {
    changes.canvasBox = newCanvasBox;
  }

  changes.selection = selection;
}

function setProseMirrorProps(
  action: SetProseMirrorPropsAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  const proseMirror = action.props;
  changes.proseMirror = proseMirror;
}

function setCanvasBox(
  action: SetCanvasBoxAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  const { canvasBox } = action;
  changes.canvasBox = canvasBox;
}

function openCellEditor(
  action: OpenCellEditorAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  changes.isEditingCell = true;
}

function closeCellEditor(
  action: CloseCellEditorAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  changes.isEditingCell = false;

  const editorState = state.proseMirror.view.state;
  const { tr, schema } = editorState;
  const { content } = action;
  const { getPos } = state.proseMirror;
  const cell = state.selection.pos;
  const pos = typeof getPos === 'function' ? getPos() : 0;
  changes.tr = setCellEntryContent(schema, tr, pos, cell.x, cell.y, content);
}

function setActive(
  action: SetActiveAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  changes.active = action.active;
}

// TODO: Avoid side-effect. It should not need to mutate the original state.
export default function canvasDataGridReducer(
  action: CanvasDataGridAction,
  state: CanvasDataGridState,
): CanvasDataGridState | null {
  const changes: CanvasDataGridStateChange = {};
  switch (action.type) {
    case 'setProseMirrorProps':
      setProseMirrorProps(action, state, changes);
      break;

    case 'setActive':
      setActive(action, state, changes);
      break;

    case 'setSelection':
      setSelection(action, state, changes);
      break;

    case 'setCanvasBox':
      setCanvasBox(action, state, changes);
      break;

    case 'openCellEditor':
      openCellEditor(action, state, changes);
      break;

    case 'closeCellEditor':
      closeCellEditor(action, state, changes);
      break;

    default:
      return null;
  }
  let changed = false;
  const changesMap: any = changes;
  const mutatableState: any = state;
  for (const prop in changesMap) {
    const value = changesMap[prop];
    if (value !== mutatableState[prop]) {
      mutatableState[prop] = value;
      changed = true;
    }
  }
  if (!changed) {
    return null;
  }

  return mutatableState;
}
