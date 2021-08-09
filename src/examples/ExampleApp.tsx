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

const SCHEMA = new Schema({
  nodes: baseSchema.spec.nodes,
  marks: baseSchema.spec.marks,
});

const DOC_JSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'hello',
        },
      ],
    },
  ],
};

const PLUGINS: Array<Plugin> = [
  history(),
  keymap({ 'Mod-z': undo, 'Mod-y': redo }),
  keymap(baseKeymap),
];

function createEditorState() {
  return EditorState.create({
    doc: SCHEMA.nodeFromJSON(DOC_JSON),
    schema: SCHEMA,
    plugins: PLUGINS,
  });
}

export default function ExampleApp() {
  const editorParentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = editorParentRef.current;
    if (el) {
      const editorState = createEditorState();
      const editorView = new EditorView(el, {
        state: editorState,
        nodeViews: {},
        dispatchTransaction(transaction: Transaction) {
          const newState = editorView.state.apply(transaction);
          editorView.updateState(newState);
        },
      });

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
