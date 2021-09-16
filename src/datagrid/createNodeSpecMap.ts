import OrderedMap from 'orderedmap';
import DataGridNodeSpec, { NODE_NAME } from './DataGridNodeSpec';
import type { NodeSpec } from 'prosemirror-model';

export type createNodeSpecMapType = () => OrderedMap<NodeSpec>;

// See https://prosemirror.net/docs/ref/#model.NodeSpec.
export default function createNodeSpecMap(): OrderedMap<NodeSpec> {
  return OrderedMap.from({
    [NODE_NAME]: DataGridNodeSpec,
  });
}
