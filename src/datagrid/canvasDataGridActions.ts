import type { ProsemirrorProps } from './canvasDataGridState';
import CellSelection from './CellSelection';
import Box from './Box';

export type SetSelectionAction = {
  type: 'setSelection';
  selection: CellSelection;
};

export type SetProseMirrorPropsAction = {
  type: 'setProseMirrorProps';
  props: ProsemirrorProps;
};

export function setSelection(selection: CellSelection): SetSelectionAction {
  return {
    type: 'setSelection',
    selection,
  };
}

export type SetCanvasBoxAction = {
  type: 'setCanvasBox';
  canvasBox: Box;
};

export function setProseMirrorProps(
  props: ProsemirrorProps,
): SetProseMirrorPropsAction {
  return {
    type: 'setProseMirrorProps',
    props,
  };
}

export type OpenCellEditorAction = {
  type: 'openCellEditor';
};

export type CloseCellEditorAction = {
  type: 'closeCellEditor';
  content: string;
};

export function setCanvasBoxAction(canvasBox: Box): SetCanvasBoxAction {
  return {
    type: 'setCanvasBox',
    canvasBox,
  };
}

export function openCellEditor(canvasBox: Box): OpenCellEditorAction {
  return {
    type: 'openCellEditor',
  };
}

export function closeCellEditor(content: string): CloseCellEditorAction {
  return {
    type: 'closeCellEditor',
    content,
  };
}

export type CanvasDataGridAction =
  | CloseCellEditorAction
  | OpenCellEditorAction
  | SetCanvasBoxAction
  | SetProseMirrorPropsAction
  | SetSelectionAction;
