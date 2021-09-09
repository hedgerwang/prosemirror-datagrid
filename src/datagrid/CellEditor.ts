import styles from './CellEditor.css';
import Vector from './Vector';
import { ReducerDispatch } from './canvasDataGridReducer';
import type { CanvasDataGridState } from './canvasDataGridState';
import { closeCellEditor } from './canvasDataGridActions';

class State {
  focusTimer = 0;
  pos = new Vector(NaN, NaN);
  visible = false;
}

export default class CellEditor {
  dom: HTMLElement;
  input: HTMLInputElement;
  state: State;

  constructor() {
    const dom = document.createElement('div');
    const input = document.createElement('input');
    dom.appendChild(input);
    dom.className = styles.dom;
    input.className = styles.input;

    this.state = new State();
    this.dom = dom;
    this.input = input;
  }

  show(
    state: CanvasDataGridState,
    dispatch: ReducerDispatch,
    x: number,
    y: number,
  ) {
    const { dom, input } = this;
    const { pos, visible } = this.state;
    const newPos = new Vector(x, y);
    if (pos.equals(newPos) && visible) {
      return;
    }
    this.state.pos = newPos;
    this.state.visible = true;
    dom.style.transform = `translate3d(${x}px,${y}px,0)`;
    dom.style.visibility = 'visible';
    input.onblur = () => {
      dispatch({
        type: 'closeCellEditor',
      });
    };
    input.onkeydown = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      const content = input.value;
      switch (e.key) {
        case 'Enter':
          dispatch(closeCellEditor(content));
          break;
        case 'Escape':
          e.preventDefault();
          dispatch(closeCellEditor(content));
          break;
        case 'Tab':
          e.preventDefault();
          dispatch(closeCellEditor(content));
          break;
      }
    };
    input.onkeypress = (e: KeyboardEvent) => {
      // Prevent ProseMirror editor from handling this event.
      e.stopImmediatePropagation();
    };
  }
  focus() {
    const { input, state } = this;
    const { visible, focusTimer } = state;
    if (visible) {
      clearTimeout(focusTimer);
      state.focusTimer = setTimeout(() => {
        input.focus();
      }, 150);
    }
  }
  hide() {
    const { dom, state, input } = this;
    const { focusTimer, visible } = state;
    if (visible) {
      state.visible = false;
      dom.style.visibility = 'hidden';
      clearTimeout(focusTimer);
      input.onblur = null;
      input.onkeypress = null;
      input.onkeydown = null;
      state.focusTimer = setTimeout(() => {
        const pe = dom.parentElement;
        pe && pe.focus();
      }, 150);
    }
  }
}
