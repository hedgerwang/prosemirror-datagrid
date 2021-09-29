import type { Node as ProsemirrorNode, DOMOutputSpec } from 'prosemirror-model';
import ProseMirrorDataGridElement from './ProseMirrorDataGridElement';

export const NODE_NAME = 'datagrid';

type DataGridNodeAttrs = {
  entries: {
    [key: string]: string;
  };
};

function parseDOMAttributes(obj: string | Node): DataGridNodeAttrs {
  if (!(obj instanceof HTMLElement)) {
    throw new Error('Expect DOM Element');
  }
  const el: HTMLElement = obj;
  return {
    entries: {},
  };
}

function toDOMAttributes(node: ProsemirrorNode): {
  [name: string]: string;
} {
  return {};
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
      tag: ProseMirrorDataGridElement.NODE_NAME,
      getAttrs: parseDOMAttributes,
    },
  ],
  toDOM(node: ProsemirrorNode): DOMOutputSpec {
    const domAttrs = toDOMAttributes(node);
    const text = '[Data Grid]';
    return [ProseMirrorDataGridElement.NODE_NAME, domAttrs, text];
  },
};

export default DataGridNodeSpec;
