import { Decoration, NodeView } from 'prosemirror-view';
import { NODE_NAME } from './DataGridNodeSpec';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import CanvasDataGrid from './CanvasDataGrid';
import type { ProsemirrorProps } from './CanvasDataGridState';

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
    [NODE_NAME]: (
      node: ProsemirrorNode,
      view: EditorView,
      getPos: (() => number) | boolean,
      decorations: Decoration[],
    ) => {
      return new DataGridNodeView({ node, view, getPos, decorations });
    },
  };
}

class DataGridNodeView {
  datagrid: CanvasDataGrid;
  dom: Node | null;
  props: ProsemirrorProps;
  selected: boolean;

  constructor(props: ProsemirrorProps) {
    const datagrid = new CanvasDataGrid(props);
    this.datagrid = datagrid;
    this.dom = datagrid.state.dom;
    this.props = props;
    this.selected = false;
  }

  update(node: ProsemirrorNode, decorations: Decoration[]) {
    const { dom, props } = this;
    if (props.node.type === node.type && dom instanceof HTMLElement) {
      const nextProps = { ...props, node, decorations };
      this.props = nextProps;
      this.datagrid.dispatch({
        type: 'setProseMirrorProps',
        props: nextProps,
      });
    }
    return true;
  }

  selectNode() {
    console.log('selectNode');
    if (!this.selected) {
      // this.reactRoot.setAttribute('tabindex', '0');
      this.selected = true;
      this.datagrid.select();
    }
  }

  deselectNode() {
    console.log('deselectNode');
    if (this.selected) {
      // this.reactRoot.removeAttribute('tabindex');
      this.selected = false;
      this.datagrid.unselect();
      // this.reactRoot.blur();
      // this.props.view.focus();
    }
  }

  stopEvent = (event: Event) => {
    return event.defaultPrevented;
  };

  destroy() {
    console.log('destroy');
    this.datagrid.destroy();
  }
}
