const DEDEFAULT_ROW_HEIGHT = 25;

import OrderedMap from 'orderedmap';

import type {
  NodeSpec,
  Node as ProsemirrorNode,
  DOMOutputSpec,
} from 'prosemirror-model';

export const NODE_NAME = 'datagrid';
export const ROW_HEIGHT_DEFAULT = 25;

type NodeAttributes = {
  rowHeight: number;
};

export enum DOMAttrs {
  data_grid = 'data-datagrid',
  row_height = 'data-datagrid-row-height',
}

export function parseDOMAttributes(obj: string | Node): NodeAttributes {
  if (!(obj instanceof HTMLElement)) {
    throw new Error('Expect DOM Element');
  }
  const el: HTMLElement = obj;
  const rowHeight = el.getAttribute(DOMAttrs.row_height);
  return createNodeAttributes({
    rowHeight: (rowHeight && Number(rowHeight)) || ROW_HEIGHT_DEFAULT,
  });
}

export function createNodeAttributes(options: {
  rowHeight?: number;
}): NodeAttributes {
  return {
    rowHeight: options.rowHeight || ROW_HEIGHT_DEFAULT,
  };
}

export function toDOMAttributes(node: ProsemirrorNode): {
  [name: string]: string;
} {
  return {
    ['className']: 'datagrid',
    [DOMAttrs.data_grid]: 'true',
    [DOMAttrs.row_height]: String(node.attrs.rowHeight),
  };
}

// See https://prosemirror.net/docs/ref/#model.NodeSpec.
export function createNodesSpec(options: {
  rowHeight?: number;
}): OrderedMap<NodeSpec> {
  const rowHeight = options.rowHeight || ROW_HEIGHT_DEFAULT;
  const nodeSpec = {
    attrs: {
      rowHeight: { default: rowHeight },
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
