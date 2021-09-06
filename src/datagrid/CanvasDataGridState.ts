import Box from './Box';
import CanvasDataGridConfig from './CanvasDataGridConfig';
import SegmentList from './SegmentList';
import styles from './CanvasDataGrid.css';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import CellSelection from './CellSelection';
import Vector from './Vector';

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
  dom.className = styles.main;
  return dom;
}

function createCanvas(dom: HTMLElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.className = styles.canvas;
  dom.appendChild(canvas);
  return canvas;
}

export type CanvasDataGridState = {
  canvas: HTMLCanvasElement;
  canvasBox: Box;
  cols: SegmentList;
  config: CanvasDataGridConfig;
  dom: HTMLElement;
  fps: number;
  lastRenderedAt: number;
  proseMirror: ProsemirrorProps;
  rows: SegmentList;
  selection: CellSelection;
};

export type CanvasDataGridStateChange = {
  canvasBox?: Box;
  proseMirror?: ProsemirrorProps;
  selection?: CellSelection;
};

export function createState(props: {
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

  cols.setSize(0, config.indexColumnWidth);
  rows.setSize(0, config.indexRowHeight);
  return {
    dom,
    canvas,
    canvasBox,
    cols,
    config,
    rows,
    selection,
    proseMirror,
    lastRenderedAt: 0,
    fps: 60,
  };
}
