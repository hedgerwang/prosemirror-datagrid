import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import SegmentList from './SegmentList';
import styles from './CanvasDataGrid.css';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import CellSelection from './CellSelection';
import Vector from './Vector';
import { ReducerDispatch } from './reducer';
import CellEditor from './CellEditor';

export type ProsemirrorProps = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

export type CanvasDataGridState = {
  canvas: HTMLCanvasElement;
  canvasBox: Box;
  cellEditor: CellEditor;
  cols: SegmentList;
  config: CanvasDataGridConfig;
  dom: HTMLElement;
  fps: number;
  isEditingCell: boolean;
  lastRenderedAt: number;
  proseMirror: ProsemirrorProps;
  rows: SegmentList;
  selection: CellSelection;
};

export type CanvasDataGridStateChange = {
  canvasBox?: Box;
  isEditingCell?: boolean;
  proseMirror?: ProsemirrorProps;
  selection?: CellSelection;
};
