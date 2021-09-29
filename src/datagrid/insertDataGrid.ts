import { Transaction } from 'prosemirror-state';
import { Fragment, Schema } from 'prosemirror-model';
import { NODE_NAME } from './DataGridNodeSpec';
import { TextSelection } from 'prosemirror-state';

export default function insertDataGrid(
  schema: Schema,
  tr: Transaction,
): Transaction {
  const nodeType = schema.nodes[NODE_NAME];
  if (!nodeType) {
    return tr;
  }

  const { selection } = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }

  const attrs = {};
  const node = nodeType.create(attrs);
  const frag = Fragment.from(node);
  const { to } = tr.selection;
  tr = tr.insert(to, frag);
  tr = tr.setSelection(TextSelection.create(tr.doc, to + 2));
  return tr;
}
