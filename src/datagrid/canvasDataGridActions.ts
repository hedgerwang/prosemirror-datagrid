import type { ProsemirrorProps } from './canvasDataGridState';
import CellSelection from './CellSelection';
import Box from './Box';
import Vector from './Vector';

export type SetSelectionAction = {
  type: 'setSelection';
  selection: CellSelection;
};

export type SetProseMirrorPropsAction = {
  type: 'setProseMirrorProps';
  props: ProsemirrorProps;
};

export type OpenCellEditorAction = {
  type: 'openCellEditor';
};

export type CloseCellEditorAction = {
  type: 'closeCellEditor';
  content: string;
};

export type SetActiveAction = {
  type: 'setActive';
  active: boolean;
};

export type SetCanvasBoxAction = {
  type: 'setCanvasBox';
  canvasBox: Box;
};

export function setSelection(selection: CellSelection): SetSelectionAction {
  return {
    type: 'setSelection',
    selection,
  };
}

export function setProseMirrorProps(
  props: ProsemirrorProps,
): SetProseMirrorPropsAction {
  return {
    type: 'setProseMirrorProps',
    props,
  };
}

export function setCanvasBoxAction(canvasBox: Box): SetCanvasBoxAction {
  return {
    type: 'setCanvasBox',
    canvasBox,
  };
}

export function openCellEditor(): OpenCellEditorAction {
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

export function setActive(active: boolean): SetActiveAction {
  return {
    type: 'setActive',
    active,
  };
}

export type CanvasDataGridAction =
  | CloseCellEditorAction
  | OpenCellEditorAction
  | SetCanvasBoxAction
  | SetProseMirrorPropsAction
  | SetActiveAction
  | SetSelectionAction;
