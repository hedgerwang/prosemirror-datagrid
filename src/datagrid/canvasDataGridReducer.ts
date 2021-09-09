import type {
  CanvasDataGridState,
  CanvasDataGridStateChange,
} from './canvasDataGridState';
import findCellBox from './findCellBox';
import type {
  CanvasDataGridAction,
  CloseCellEditorAction,
  OpenCellEditorAction,
  SetCanvasBoxAction,
  SetProseMirrorPropsAction,
  SetSelectionAction,
} from './canvasDataGridActions';

export type ReducerDispatch = (action: CanvasDataGridAction) => void;

function setSelection(
  action: SetSelectionAction,
  state: CanvasDataGridState,
  changes: CanvasDataGridStateChange,
) {
  const { canvasBox } = state;
  const { selection } = action;
  const cellBox = findCellBox(state, selection.pos);
  if (
    (cellBox && cellBox.isOutsideOf(canvasBox)) ||
    (cellBox && cellBox.isCorssBoundaryOf(canvasBox)) ||
    (cellBox && cellBox.isInsideAtBoundaryOf(canvasBox))
  ) {
    // The selected cell should be scrolled into canvas.
    const cellCenter = cellBox.getCenter();
    const canvasCenter = canvasBox.getCenter();
    const angle = cellCenter.getAngleFrom(canvasCenter);

    let newCanvasBox = canvasBox;
    if (angle >= 45 && angle <= 135) {
      //     \   /
      //      \ /__
      //      / \
      //     /   \
      // right
      newCanvasBox = newCanvasBox.moveBy(cellBox.w, 0);
    } else if (angle >= 315 || angle <= 45) {
      //     \ | /
      //      \|/
      //      / \
      //     /   \
      // up
      newCanvasBox = newCanvasBox.moveBy(0, -cellBox.h);
    } else if (angle >= 225 && angle <= 315) {
      //     \   /
      //    __\ /
      //      / \
      //     /   \
      // left
      newCanvasBox = newCanvasBox.moveBy(-cellBox.w, 0);
    } else if (angle >= 135 && angle <= 225) {
      //     \   /
      //      \ /
      //      /|\
      //     / | \
      // down
      newCanvasBox = newCanvasBox.moveBy(0, cellBox.h);
    }

    const { x, y } = newCanvasBox;
    newCanvasBox = newCanvasBox.moveBy(x < 0 ? -x : 0, y < 0 ? -y : 0);

    if (!newCanvasBox.equals(canvasBox)) {
      changes.canvasBox = newCanvasBox;
    }
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
