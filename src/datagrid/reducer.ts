import type {
  CanvasDataGridState,
  ProsemirrorProps,
  CanvasDataGridStateChange,
} from './CanvasDataGridState';
import CellSelection from './CellSelection';
import Box from './Box';

export type ReducerAction =
  | {
      type: 'setProseMirrorProps';
      props: ProsemirrorProps;
    }
  | {
      type: 'setSelection';
      selection: CellSelection;
    }
  | {
      type: 'setCanvasBox';
      canvasBox: Box;
    };

// TODO: Avoid side-effect. It should not need to mutate the original state.
export default function reducer(
  action: ReducerAction,
  state: CanvasDataGridState,
): CanvasDataGridState | null {
  const changes: CanvasDataGridStateChange = {};
  switch (action.type) {
    case 'setProseMirrorProps':
      const proseMirror = action.props;
      changes.proseMirror = proseMirror;
      break;

    case 'setSelection':
      const { selection } = action;
      changes.selection = selection;
      break;

    case 'setCanvasBox':
      const { canvasBox } = action;
      changes.canvasBox = canvasBox;
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
