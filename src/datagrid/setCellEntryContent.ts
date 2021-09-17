import { Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { NODE_NAME } from './DataGridNodeSpec';
import Vector from './Vector';
import getCellEntryKey from './getCellEntryKey';

export default function setCellEntryContent(
  schema: Schema,
  tr: Transaction,
  pos: number,
  colIndex: number,
  rowIndex: number,
  content: string,
): Transaction {
  const nodeType = schema.nodes[NODE_NAME];
  if (!nodeType) {
    return tr;
  }
  const node = tr.doc.nodeAt(pos);
  if (!node) {
    throw new Error(`Unable to find Node at ${pos}`);
  }
  if (node.type !== nodeType) {
    throw new Error(
      `Expect Node to be ${NODE_NAME}, received ${node.type.name}`,
    );
  }
  const { marks, attrs } = node;
  const key = getCellEntryKey(colIndex, rowIndex);
  const newAttrs = {
    ...attrs,
    entries: {
      ...attrs.entries,
      [key]: content,
    },
  };
  tr = tr.setNodeMarkup(pos, nodeType, newAttrs, marks);
  return tr;
}
