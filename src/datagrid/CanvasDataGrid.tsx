import * as React from 'react';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import styles from './CanvasDataGrid.css';
import { useEffect, memo, useRef } from 'react';
import type { RefObject } from 'react';
import useElementSize from './useElementSize';
import canvasDataGrid from 'canvas-datagrid';

export type Props = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
  onControlInputKeyDown: (event: KeyboardEvent) => void;
};

const A2Z: string[] = new Array(26)
  .fill(0)
  .map((_, ii) => (ii + 10).toString(36).toUpperCase());

const DEFAULT_DATA = Object.freeze(
  new Array(40).fill(0).map((ii) => {
    return A2Z.reduce((cols: any, col, ii) => {
      cols[String(col)] = '';
      return cols;
    }, {});
  }),
);

const CanvasDataGrid = memo(function CanvasDataGrid(props: Props) {
  const { onControlInputKeyDown } = props;
  const hostRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLElement>(null);
  const size = useElementSize(hostRef);

  useEffect(() => {
    const grid = canvasDataGrid();
    Object.assign(gridRef, { current: grid });
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const grid = gridRef.current;
    if (grid && host) {
      grid.classList.add(styles.canvasDataGrid);
      const canvasGrid: any = grid;
      canvasGrid.data = DEFAULT_DATA;

      const input: HTMLInputElement = canvasGrid.controlInput;

      // input.style.cssText += `;opacity: 1; width: 100px; height: 100px;background: yellow`;
      input.addEventListener('keydown', onControlInputKeyDown, true);

      host.appendChild(canvasGrid);
      return () => {
        input.removeEventListener('keydown', onControlInputKeyDown, true);
      };
    }
  });

  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.style.width = size.width + 'px';
      grid.style.height = size.height + 'px';
    }
  }, [size]);

  return (
    <div className={styles.main}>
      <div className={styles.canvasDataGridHost} ref={hostRef}></div>
    </div>
  );
});

export default CanvasDataGrid;
