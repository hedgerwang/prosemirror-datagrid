import * as React from 'react';
import styles from './ExampleApp.css';
import { useLayoutEffect, useRef } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Plugin, Transaction } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { undo, redo, history } from 'prosemirror-history';
import { createNodesSpec, NODE_NAME } from '../datagrid/DatagridNodeSpec';
import insertDataGrid from '../datagrid/InsertDataGrid';
import { createDataGridNodeViewsRenderingMap } from '../datagrid/DataGridNodeView';

function createEditorState() {
  const nodes: any = baseSchema.spec.nodes;

  const schema = new Schema({
    nodes: nodes.append(createNodesSpec({})),
    marks: baseSchema.spec.marks,
  });

  const plugins = [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap),
  ];

  const state = EditorState.create({
    doc: schema.nodeFromJSON({ type: 'doc' }),
    schema: schema,
    plugins,
  });

  let { tr } = state;
  tr = tr.insertText('some text here');
  tr = insertDataGrid(state.schema, tr);
  tr = tr.insertText('some text here some text here some text here');
  // tr = insertDataGrid(state.schema, tr);
  tr = tr.insertText('some text here');

  return state.apply(tr);
}

function createEditorView(el: HTMLElement) {
  const editorState = createEditorState();
  const editorView = new EditorView(el, {
    state: editorState,
    nodeViews: { ...createDataGridNodeViewsRenderingMap() },
    dispatchTransaction(transaction: Transaction) {
      const newState = editorView.state.apply(transaction);
      editorView.updateState(newState);
    },
  });
  return editorView;
}

export default function ExampleApp() {
  const editorParentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = editorParentRef.current;
    if (el) {
      const editorView = createEditorView(el);
      const timer = setTimeout(() => {
        editorView.focus();
      }, 200);
      return () => {
        clearTimeout(timer);
        editorView.destroy();
      };
    }
  }, []);

  return (
    <div className={styles.main}>
      <h1>Example App</h1>
      <div className={styles.editorParentRef} ref={editorParentRef} />
    </div>
  );
}
