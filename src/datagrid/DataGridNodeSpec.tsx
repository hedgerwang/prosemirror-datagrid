const DEDEFAULT_ROW_HEIGHT = 25;

import OrderedMap from 'orderedmap';

import type {
  NodeSpec,
  Node as ProsemirrorNode,
  DOMOutputSpec,
} from 'prosemirror-model';

export const NODE_NAME = 'datagrid';

type NodeAttributes = {
  entries: {
    [key: string]: string;
  };
};

export enum DOMAttrs {
  data_grid = 'data-datagrid',
  data_grid_entries = 'data-datagrid-entries',
}

export function parseDOMAttributes(obj: string | Node): NodeAttributes {
  if (!(obj instanceof HTMLElement)) {
    throw new Error('Expect DOM Element');
  }
  const el: HTMLElement = obj;
  return {
    entries: {},
  };
}

export function toDOMAttributes(node: ProsemirrorNode): {
  [name: string]: string;
} {
  return {
    ['className']: 'datagrid',
    [DOMAttrs.data_grid]: 'true',
    [DOMAttrs.data_grid_entries]: '{}',
  };
}

// See https://prosemirror.net/docs/ref/#model.NodeSpec.
export function createNodesSpec(options: {}): OrderedMap<NodeSpec> {
  const nodeSpec = {
    attrs: {
      entries: { default: {} },
    },
    atom: true,
    defining: true,
    draggable: false,
    group: 'block',
    isolating: true,
    selectable: true,
    parseDOM: [
      {
        tag: `div[${DOMAttrs.data_grid}]`,
        getAttrs: parseDOMAttributes,
      },
    ],
    toDOM(node: ProsemirrorNode): DOMOutputSpec {
      const domAttrs = toDOMAttributes(node);
      const csvText = 'Sample CSV text';
      return ['div', domAttrs, csvText];
    },
  };
  return OrderedMap.from({
    [NODE_NAME]: nodeSpec,
  });
}
