import { Decoration, NodeView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';
import CanvasDataGrid from './CanvasDataGrid';
import type { ProsemirrorProps } from './canvasDataGridState';

export default class DataGridNodeView {
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
    if (!this.selected) {
      this.selected = true;
      this.datagrid.focus();
    }
  }

  deselectNode() {
    if (this.selected) {
      this.selected = false;
    }
  }

  stopEvent = (event: Event) => {
    return event.defaultPrevented;
  };

  destroy() {
    this.datagrid.destroy();
  }
}
