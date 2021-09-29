import { Decoration, NodeView } from 'prosemirror-view';
import { NODE_NAME } from './DataGridNodeSpec';
import { EditorView } from 'prosemirror-view';
import type { Node as ProsemirrorNode } from 'prosemirror-model';

import DataGridNodeView from './DataGridNodeView';

export type NodeViewRenderer = (
  node: ProsemirrorNode,
  view: EditorView,
  getPos: (() => number) | boolean,
  decorations: Decoration[],
) => NodeView;

// Allows you to pass custom rendering and behavior logic for nodes and marks.
// Should map node and mark names to constructor functions that produce a
// NodeView object implementing the node's display behavior.
export default function createNodeViewsMap(): {
  [name: string]: NodeViewRenderer;
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
