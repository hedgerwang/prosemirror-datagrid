import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import SegmentList from './SegmentList';
import CanvasDataGridSheet from './CanvasDataGrid.css';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import CellSelection from './CellSelection';
import Vector from './Vector';
import CellEditor from './CellEditor';
import type { CanvasDataGridState } from './canvasDataGridState';
import createStyleElement from './createStyleElement';
import ProseMirrorDataGridElement from './ProseMirrorDataGridElement';

const styles = CanvasDataGridSheet.locals;
const DEFAULT_ROW_HEIGHT = 32;
const DEFAULT_COL_WIDTH = 120;

export type ProsemirrorProps = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

function createDOM(): ProseMirrorDataGridElement {
  const dom = ProseMirrorDataGridElement.createElement(document);
  dom.className = styles.main;
  dom.tabIndex = 0;
  dom.appendChild(createStyleElement(CanvasDataGridSheet));
  return dom;
}

function createCellEditor(dom: ProseMirrorDataGridElement): any {
  const editor = new CellEditor();
  dom.appendChild(editor.dom);
  return editor;
}

function createCanvas(dom: ProseMirrorDataGridElement): HTMLCanvasElement {
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
  const canvasBox = new Box(0, 0, 700, 400);
  const canvas = createCanvas(dom);
  const rows = new SegmentList(DEFAULT_ROW_HEIGHT);
  const cols = new SegmentList(DEFAULT_COL_WIDTH);
  const selection = new CellSelection(new Vector(1, 1));
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
    maxColIndex: 26,
    maxRowIndex: 1000,
    proseMirror,
    rows,
    selection,
    tr: null,
  };
}
