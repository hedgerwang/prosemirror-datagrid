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

export default function useElementSize(elRef: RefObject<HTMLElement>): {
  width: number;
  height: number;
} {
  const [elSize, setElSize] = useState({ width: 0, height: 0 });
  const isMounted = useRef(!!elRef.current);

  const reflow = useCallback(() => {
    const el = elRef.current;
    if (el instanceof HTMLElement) {
      const { offsetWidth, offsetHeight } = el;

      setElSize({
        width: offsetWidth,
        height: offsetHeight,
      });

      if (!offsetHeight || !offsetWidth) {
        requestAnimationFrame(() => {
          if (!isMounted.current && el.isConnected === true) {
            // mounting.
            isMounted.current = true;
            reflow();
          } else if (isMounted.current && el.isConnected === true) {
            // unmounting.
            isMounted.current = false;
          }
        });
      }
    }
  }, []);

  useLayoutEffect(() => {
    reflow();
    window.addEventListener('resize', reflow, true);
    return () => {
      window.removeEventListener('resize', reflow, true);
    };
    return;
  }, [reflow]);

  return elSize;
}
