import { Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { NODE_NAME } from './DatagridNodeSpec';
import Vector from './Vector';
import getCellAttrKey from './getCellAttrKey';

export default function setCellContent(
  schema: Schema,
  tr: Transaction,
  pos: number,
  cell: Vector,
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
  const key = getCellAttrKey(cell);
  const newAttrs = {
    ...attrs,
    [key]: content,
  };
  tr = tr.setNodeMarkup(pos, nodeType, newAttrs, marks);
  return tr;
}
