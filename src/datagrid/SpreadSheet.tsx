import * as React from 'react';
import { Decoration } from 'prosemirror-view';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import styles from './SpreadSheet.css';
import { useEffect, memo, useRef } from 'react';
import type { RefObject } from 'react';
import useElementSize from './useElementSize';
// import Spreadsheet from 'x-data-spreadsheet';

type Props = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

const SpreadSheet = memo(function SpreadSheet(props: Props) {
  const spreadSheetElRef = useRef<HTMLDivElement>(null);
  const spreadSheetRef = useRef<any>(null);
  const gridSize = useElementSize(spreadSheetElRef);
  const viewSizeRef = useRef<any>({
    height: () => 0,
    width: () => 0,
  });

  useEffect(() => {
    viewSizeRef.current = {
      height: () => gridSize.height,
      width: () => gridSize.width,
    };
    const sheet = spreadSheetRef.current;
    const el = spreadSheetElRef.current;
    if (sheet && el) {
      // TODO: This will clear all UI state!.
      el.innerHTML = '';
      spreadSheetRef.current = null;
    }
  }, [gridSize]);

  useEffect(() => {
    const win: any = window;
    const el = spreadSheetElRef.current;
    if (el && !spreadSheetRef.current && gridSize.width && gridSize.height) {
      const sheet = win.x_spreadsheet(el, {
        mode: 'edit', // edit | read
        showToolbar: true,
        showGrid: true,
        showContextmenu: true,
        view: viewSizeRef.current,
        row: {
          len: 100,
          height: 25,
        },
        col: {
          len: 26,
          width: 100,
          indexWidth: 60,
          minWidth: 60,
        },
        style: {
          bgcolor: '#ffffff',
          align: 'left',
          valign: 'middle',
          textwrap: false,
          strike: false,
          underline: false,
          color: '#0a0a0a',
          font: {
            name: 'Helvetica',
            size: 10,
            bold: false,
            italic: false,
          },
        },
      });
      spreadSheetRef.current = sheet;
      win.__sheet = sheet;
    }
  }, [gridSize]);
  return (
    <div className={`spread-sheet-main ${styles.main}`}>
      <div
        className={`spread-sheet ${styles.spreadSheet}`}
        ref={spreadSheetElRef}
      />
    </div>
  );
});

export default SpreadSheet;
