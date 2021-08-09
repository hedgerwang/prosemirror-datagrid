import * as React from 'react';
import { Decoration, NodeView } from 'prosemirror-view';
import { NODE_NAME, toDOMAttributes } from './DataGridNodeSpec';
import { EditorView } from 'prosemirror-view';
import { render, unmountComponentAtNode } from 'react-dom';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
// import DataGrid from '../trash/DataGrid';
// import SpreadSheet from './SpreadSheet';
import CanvasDataGrid from './CanvasDataGrid';
import { TextSelection } from 'prosemirror-state';
import { nodes } from 'prosemirror-schema-basic';
import styles from './DataGridNodeView.css';
import type { Props as CanvasDataGridProps } from './CanvasDataGrid';

type Props = {
  node: ProsemirrorNode;
  view: EditorView;
  getPos: (() => number) | boolean;
  decorations: Decoration[];
};

type ReactProps = Props;

type EventHandlers = { [name: string]: (e: Event) => void };

function renderDataGridNodeView(
  node: ProsemirrorNode,
  view: EditorView,
  getPos: (() => number) | boolean,
  decorations: Decoration[],
): NodeView {
  return new DataGridNodeView({ node, view, getPos, decorations });
}

// Allows you to pass custom rendering and behavior logic for nodes and marks.
// Should map node and mark names to constructor functions that produce a
// NodeView object implementing the node's display behavior.
export function createDataGridNodeViewsRenderingMap(): {
  [name: string]: (
    node: ProsemirrorNode,
    view: EditorView,
    getPos: (() => number) | boolean,
    decorations: Decoration[],
  ) => NodeView;
} {
  return {
    [NODE_NAME]: renderDataGridNodeView,
  };
}

function createDOM(props: Props): HTMLElement {
  const dom = document.createElement('div');
  const domAttrs = toDOMAttributes(props.node);
  Object.keys(domAttrs).forEach((name) => {
    if (name === 'className') {
      dom[name] = domAttrs[name];
    } else {
      dom.setAttribute(name, domAttrs[name]);
    }
  });
  dom.classList.add(styles.dataGrid);
  return dom;
}

function renderDataGrid(dom: HTMLElement, props: CanvasDataGridProps) {
  console.log('renderReact');
  const { node } = props;
  const domAttrs = toDOMAttributes(node);
  Object.keys(domAttrs).forEach((name) => {
    dom.setAttribute(name, domAttrs[name]);
  });
  render(<CanvasDataGrid {...props} />, dom);
}

function destroyDataGrid(dom: HTMLElement) {
  unmountComponentAtNode(dom);
}

const KEYBOARD_NAV_KEYS = new Set([
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
]);

class DataGridNodeView {
  dom: Node | null;
  props: Props;
  reactRoot: HTMLElement;
  selected: boolean;
  focusTimer: number;
  handlers: EventHandlers;

  constructor(props: Props) {
    const dom = createDOM(props);
    this.dom = dom;
    this.reactRoot = dom;
    this.props = props;
    this.selected = false;
    this.focusTimer = 0;
    dom.setAttribute('tabindex', '0');

    this.handlers = {
      wheel: this._preventEvent,
      dragstart: this._preventEvent,
      keydown: this._onKeyDown,
      mousedown: this._onMouseDown,
    };

    Object.keys(this.handlers).forEach((type) => {
      dom.addEventListener(type, this.handlers[type], true);
    });

    renderDataGrid(this.reactRoot, {
      ...props,
      onControlInputKeyDown: this._onControlInputKeyDown,
    });
  }

  update(node: ProsemirrorNode, decorations: Decoration[]) {
    const { dom, props } = this;
    if (props.node.type === node.type && dom instanceof HTMLElement) {
      const nextProps = { ...props, node, decorations };
      this.props = nextProps;
      renderDataGrid(this.reactRoot, {
        ...nextProps,
        onControlInputKeyDown: this._onControlInputKeyDown,
      });
    }
    return true;
  }

  selectNode() {
    console.log('selectNode');
    if (!this.selected) {
      // this.reactRoot.setAttribute('tabindex', '0');
      this.selected = true;
      this.reactRoot.classList.add(styles.selected);
      this.focusTimer = setTimeout(() => {
        this.reactRoot.focus();
      }, 16);
    }
  }

  deselectNode() {
    console.log('deselectNode');
    if (this.selected) {
      // this.reactRoot.removeAttribute('tabindex');
      clearTimeout(this.focusTimer);
      this.focusTimer = 0;
      this.selected = false;
      this.reactRoot.classList.remove(styles.selected);
      // this.reactRoot.blur();
      // this.props.view.focus();
    }
  }

  stopEvent = (event: Event) => {
    return event.defaultPrevented;
  };

  destroy() {
    console.log('destroy');
    const { reactRoot } = this;
    destroyDataGrid(this.reactRoot);
    reactRoot.removeEventListener('wheel', this.stopEvent);
    Object.keys(this.handlers).forEach((type) => {
      reactRoot.removeEventListener(type, this.handlers[type], true);
    });
  }

  _onMouseDown = (event: Event) => {
    if (this.selected) {
      return;
    }
    const { node, getPos, view } = this.props;
    if (typeof getPos !== 'function') {
      return;
    }
    const { tr, doc } = view.state;
    const pos = getPos();
    const selection = TextSelection.create(doc, pos, pos);
    view.dispatch(tr.setSelection(selection));
    this.selectNode();
    event.preventDefault();
  };

  _preventEvent = (event: Event) => {
    event.preventDefault();
  };

  _onKeyDown = (event: Event) => {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const { key, target } = event;
    console.log('onKeyDown', key);

    const { reactRoot, selected, props } = this;
    if (!selected || target !== reactRoot) {
      return;
    }

    const { node, getPos, view } = props;
    if (typeof getPos !== 'function') {
      return;
    }

    const { tr, doc } = view.state;
    const pos = getPos();

    if (key === 'ArrowUp' || key === 'ArrowLeft') {
      clearTimeout(this.focusTimer);
      reactRoot.blur();
      const selection = TextSelection.create(doc, pos - 1, pos - 1);
      view.dispatch(tr.setSelection(selection));
      this.deselectNode();
      view.focus();
      event.preventDefault();
      return;
    }

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      clearTimeout(this.focusTimer);
      reactRoot.blur();
      const selection = TextSelection.create(
        doc,
        pos + node.nodeSize,
        pos + node.nodeSize,
      );
      view.dispatch(tr.setSelection(selection));
      this.deselectNode();
      view.focus();
      event.preventDefault();
      return;
    }

    this._startEditing();
    event.preventDefault();
  };

  _onControlInputKeyDown = (event: KeyboardEvent) => {
    const { reactRoot } = this;
    if (event.key === 'Escape') {
      // focus to NodeView so it can move cursur off grid.
      reactRoot.focus();
    }
  };

  _startEditing() {
    const { reactRoot } = this;
    const grid: any = reactRoot.querySelector('canvas-datagrid');
    if (!grid) {
      return;
    }
    const { activeCell } = grid;
    if (activeCell) {
      const { rowIndex, columnIndex } = activeCell;
      grid.scrollIntoView(columnIndex, rowIndex);
      grid.beginEditAt(columnIndex, rowIndex, false);
    } else {
      grid.scrollIntoView(0, 0);
      grid.beginEditAt(0, 0, false);
    }
  }
}
