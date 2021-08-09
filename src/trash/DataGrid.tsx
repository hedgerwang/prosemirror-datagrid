import * as React from 'react';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import styles from './DataGrid.css';
import {
  useEffect,
  useLayoutEffect,
  memo,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { RefObject } from 'react';

type Props = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

const COUNTER_CELL_WIDTH = 50;

const COLUMN_LABELS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const Cell = memo(function Cell(props: {
  colWidth: number;
  colIndex: number;
  rowIndex: number;
  rowHeight: number;
}) {
  const { colWidth, colIndex, rowHeight, rowIndex } = props;
  const style = { height: `${rowHeight}px`, width: `${colWidth}px` };
  let data = null;
  if (rowIndex < 0) {
    data = COLUMN_LABELS[colIndex];
  } else if (colIndex < 0) {
    data = String(rowIndex + 1);
  } else {
    data = `${rowIndex} - ${colIndex}`;
  }
  return (
    <div className={`datagrid-cell ${styles.cell}`} style={style}>
      {data}
    </div>
  );
});

const Row = memo(function Row(props: {
  colIndexStart: number;
  colWidthDefault: number;
  gridWidth: number;
  rowHeight: number;
  rowIndex: number;
}) {
  const { colIndexStart, rowHeight, rowIndex, gridWidth, colWidthDefault } =
    props;

  const maxColIndex = COLUMN_LABELS.length - 1;
  const cells = [
    <Cell
      colIndex={-1}
      colWidth={COUNTER_CELL_WIDTH}
      key="c_counter"
      rowHeight={rowHeight}
      rowIndex={rowIndex}
    />,
  ];
  let visibleColsWidth = 0;
  let colIndex = colIndexStart;
  while (visibleColsWidth < gridWidth) {
    const colWidth = colWidthDefault;
    cells.push(
      <Cell
        colIndex={colIndex}
        colWidth={colWidth}
        key={`c_${colIndex}`}
        rowHeight={rowHeight}
        rowIndex={rowIndex}
      />,
    );
    visibleColsWidth += colWidth;
    colIndex++;
  }
  const style = {
    height: `${rowHeight}}px`,
  };
  return (
    <div className={`datagrid-row ${styles.row}`} style={style}>
      {cells}
    </div>
  );
});

function useWheelScroll(tableRef: RefObject<HTMLDivElement>) {
  const [rowIndexStart, setRowIndexStart] = useState(0);
  const [colIndexStart, setColIndexStart] = useState(0);
  const onWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const { deltaX, deltaY, detail } = event;
      if (deltaY !== 0) {
        const ii = Math.max(0, rowIndexStart + (deltaY < 0 ? 1 : -1));
        if (ii !== rowIndexStart) {
          setRowIndexStart(ii);
        }
      }
      if (deltaX !== 0) {
        const jj = Math.min(
          Math.max(0, colIndexStart + (deltaX < 0 ? 1 : -1)),
          COLUMN_LABELS.length - 1,
        );
        if (jj !== colIndexStart) {
          setColIndexStart(jj);
        }
      }
    },
    [rowIndexStart, colIndexStart],
  );

  useEffect(() => {
    const el = tableRef.current;
    if (el instanceof HTMLElement) {
      const handler = onWheel;
      el.addEventListener('wheel', handler, { passive: false });
      return () => {
        el.removeEventListener('wheel', handler);
      };
    }
  }, [onWheel]);
  return { rowIndexStart, colIndexStart };
}

function useGridSize(tableRef: RefObject<HTMLDivElement>) {
  const [gridSize, setGridSize] = useState([1000, 200]);
  const reflow = useCallback((counter: number) => {
    const el = tableRef.current;
    if (el instanceof HTMLElement) {
      const { offsetWidth, offsetHeight } = el;
      console.log({ offsetWidth, offsetHeight });
      setGridSize([offsetWidth, offsetHeight]);
      if (!offsetWidth || !offsetHeight) {
        // Wait until the el becomes visible.
        if (counter < 10) {
          requestAnimationFrame(() => reflow(counter + 1));
        }
      }
    }
  }, []);
  useLayoutEffect(() => reflow(0), []);
  return gridSize;
}

const DataGrid = memo(function DataGrid(props: Props) {
  const tableRef = useRef<HTMLDivElement>(null);
  const { rowIndexStart, colIndexStart } = useWheelScroll(tableRef);
  const rowHeightDefault = 25;
  const colWidthDefault = 180;
  const [gridWidth, gridHeight] = useGridSize(tableRef);
  const rows = [
    <Row
      colWidthDefault={colWidthDefault}
      rowHeight={rowHeightDefault}
      key={`row_start`}
      rowIndex={-1}
      colIndexStart={colIndexStart}
      gridWidth={gridWidth}
    />,
  ];

  let visibleRowsHeight = 0;
  let rowIndex = rowIndexStart;
  while (visibleRowsHeight < gridHeight) {
    rows.push(
      <Row
        colIndexStart={colIndexStart}
        colWidthDefault={colWidthDefault}
        gridWidth={gridWidth}
        key={`row_${rowIndex}`}
        rowHeight={rowHeightDefault}
        rowIndex={rowIndex}
      />,
    );
    visibleRowsHeight += rowHeightDefault;
    rowIndex++;
  }

  return (
    <div className={`datagrid-main ${styles.main}`}>
      <div className={`datagrid-table ${styles.table}`} ref={tableRef}>
        {rows}
      </div>
    </div>
  );
});
export default DataGrid;
