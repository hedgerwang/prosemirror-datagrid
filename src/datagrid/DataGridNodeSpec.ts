import type { Node as ProsemirrorNode, DOMOutputSpec } from 'prosemirror-model';

export const NODE_NAME = 'datagrid';

export type DataGridNodeAttrs = {
  entries: {
    [key: string]: string;
  };
};

export enum DataGridNodeDOMAttrs {
  data_grid = 'data-datagrid',
  data_grid_entries = 'data-datagrid-entries',
}

export function parseDOMAttributes(obj: string | Node): DataGridNodeAttrs {
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
    [DataGridNodeDOMAttrs.data_grid]: 'true',
    [DataGridNodeDOMAttrs.data_grid_entries]: '{}',
  };
}

const DataGridNodeSpec = {
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
      tag: `div[${DataGridNodeDOMAttrs.data_grid}]`,
      getAttrs: parseDOMAttributes,
    },
  ],
  toDOM(node: ProsemirrorNode): DOMOutputSpec {
    const domAttrs = toDOMAttributes(node);
    const csvText = 'Sample CSV text';
    return ['div', domAttrs, csvText];
  },
};

export default DataGridNodeSpec;
