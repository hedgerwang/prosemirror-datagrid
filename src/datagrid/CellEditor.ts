import CellEditorSheet from './CellEditor.css';
import Vector from './Vector';
import { ReducerDispatch } from './canvasDataGridReducer';
import type { CanvasDataGridState } from './canvasDataGridState';
import { closeCellEditor } from './canvasDataGridActions';
import getCellEntryContent from './getCellEntryContent';
import createStyleElement from './createStyleElement';

const styles = CellEditorSheet.locals;

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

    dom.appendChild(createStyleElement(CellEditorSheet));
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

    const cell = state.selection.pos;
    const submit = () => {
      const content = input.value;
      dispatch(closeCellEditor(content));
    };

    input.value = getCellEntryContent(state, cell.x, cell.y);
    input.onmousedown = (e) => {
      e.preventDefault();
    };
    input.onpaste = (e) => {
      // block prose-mirror.
      e.stopImmediatePropagation();
    };
    input.oncut = (e) => {
      // block prose-mirror.
      e.stopImmediatePropagation();
    };
    input.onblur = submit;

    input.onkeydown = (e: KeyboardEvent) => {
      // block prose-mirror.
      e.stopImmediatePropagation();

      switch (e.key) {
        case 'Enter':
        case 'Escape':
        case 'Tab':
          e.preventDefault();
          submit();
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
      input.onpaste = null;
      input.oncopy = null;
      input.onkeydown = null;
      state.focusTimer = setTimeout(() => {
        const pe = dom.parentElement;
        pe && pe.focus();
      }, 0);
    }
  }
}
