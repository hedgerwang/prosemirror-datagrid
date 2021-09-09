import type { ProsemirrorProps } from './canvasDataGridState';
import CellSelection from './CellSelection';
import Box from './Box';

type SetSelectionAction = {
  type: 'setSelection';
  selection: CellSelection;
};

export function setSelection(selection: CellSelection): SetSelectionAction {
  return {
    type: 'setSelection',
    selection,
  };
}

type SetProseMirrorPropsAction = {
  type: 'setProseMirrorProps';
  props: ProsemirrorProps;
};

export function setProseMirrorProps(
  props: ProsemirrorProps,
): SetProseMirrorPropsAction {
  return {
    type: 'setProseMirrorProps',
    props,
  };
}

type SetCanvasBoxAction = {
  type: 'setCanvasBox';
  canvasBox: Box;
};

export function setCanvasBoxAction(canvasBox: Box): SetCanvasBoxAction {
  return {
    type: 'setCanvasBox',
    canvasBox,
  };
}

type OpenCellEditorAction = {
  type: 'openCellEditor';
};

export function openCellEditor(canvasBox: Box): OpenCellEditorAction {
  return {
    type: 'openCellEditor',
  };
}

type CloseCellEditorAction = {
  type: 'closeCellEditor';
};

export function closeCellEditor(canvasBox: Box): CloseCellEditorAction {
  return {
    type: 'closeCellEditor',
  };
}

export type CanvasDataGridAction =
  | CloseCellEditorAction
  | OpenCellEditorAction
  | SetCanvasBoxAction
  | SetProseMirrorPropsAction
  | SetSelectionAction;
