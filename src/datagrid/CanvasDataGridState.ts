import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import SegmentList from './SegmentList';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import CellSelection from './CellSelection';
import CellEditor from './CellEditor';
import { Transaction } from 'prosemirror-state';

export type ProsemirrorProps = {
  node: ProsemirrorNode;
  view: EditorView;
  // . For nodes, the third argument getPos is a function that can be called to
  // get the node's current position, which can be useful when creating
  // transactions to update it. For marks, the third argument is a boolean
  // that indicates whether the mark's content is inline.
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

export type CanvasDataGridState = {
  active: boolean;
  canvas: HTMLCanvasElement;
  canvasBox: Box;
  cellEditor: CellEditor;
  cols: SegmentList;
  config: CanvasDataGridConfig;
  dom: HTMLElement;
  fps: number;
  isEditingCell: boolean;
  lastRenderedAt: number;
  maxColIndex: number;
  maxRowIndex: number;
  proseMirror: ProsemirrorProps;
  rows: SegmentList;
  selection: CellSelection;
  tr: Transaction | null;
};

export type CanvasDataGridStateChange = {
  active?: boolean;
  canvasBox?: Box;
  isEditingCell?: boolean;
  proseMirror?: ProsemirrorProps;
  selection?: CellSelection;
  tr?: Transaction;
};
