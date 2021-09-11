import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import SegmentList from './SegmentList';
import styles from './CanvasDataGrid.css';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import CellSelection from './CellSelection';
import Vector from './Vector';
import { ReducerDispatch } from './canvasDataGridReducer';
import CellEditor from './CellEditor';
import type { CanvasDataGridState } from './canvasDataGridState';

const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_COL_WIDTH = 120;

export type ProsemirrorProps = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

function createDOM(): HTMLElement {
  const dom = document.createElement('div');
  dom.tabIndex = 0;
  return dom;
}

function createCellEditor(dom: HTMLElement): any {
  const editor = new CellEditor();
  dom.appendChild(editor.dom);
  return editor;
}

function createCanvas(dom: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.className = styles.canvas;
  dom.appendChild(canvas);
  return canvas;
}

export default function createCanvasDataGridState(props: {
  proseMirror: ProsemirrorProps;
}): CanvasDataGridState {
  const { proseMirror } = props;
  const config = new CanvasDataGridConfig();
  const dom = createDOM();
  const canvasBox = new Box(0, 0, 760, 400);
  const canvas = createCanvas(dom);
  const rows = new SegmentList(DEFAULT_ROW_HEIGHT);
  const cols = new SegmentList(DEFAULT_COL_WIDTH);
  const selection = new CellSelection(new Vector(0, 0));
  const cellEditor = createCellEditor(dom);

  cols.setSize(0, config.indexColumnWidth);
  rows.setSize(0, config.indexRowHeight);
  return {
    active: false,
    canvas,
    canvasBox,
    cellEditor,
    cols,
    config,
    dom,
    fps: 60,
    isEditingCell: false,
    lastRenderedAt: 0,
    maxColIndex: 1000,
    maxRowIndex: 1000,
    proseMirror,
    rows,
    selection,
    tr: null,
  };
}
