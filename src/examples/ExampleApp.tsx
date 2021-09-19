import * as React from 'react';
import ExampleAppSheet from './ExampleApp.css';
import { useLayoutEffect, useState, useRef, useCallback, memo } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { baseKeymap } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { undo, redo, history } from 'prosemirror-history';
import { addListNodes } from 'prosemirror-schema-list';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import Template from './Template';
import Toolbar from './Toolbar';
import { render } from 'react-dom';
import Style from './Style';

import { createNodeSpecMap, createNodeViewsMap } from 'prosemirror-datagrid';

const styles = ExampleAppSheet.locals;

function createSchema() {
  const nodes: any = addListNodes(
    basicSchema.spec.nodes,
    'paragraph block*',
    'block',
  );

  const schema = new Schema({
    nodes: nodes.append(createNodeSpecMap()),
    marks: basicSchema.spec.marks,
  });

  return schema;
}

function createPlugins() {
  return [
    history(),
    // https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js
    keymap({ 'Mod-z': undo, 'Mod-Shift-z': redo }),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
  ];
}

function createInitialEditorState(schema: Schema, plugins: Array<Plugin>) {
  const dom = document.createElement('div');
  render(<Template />, dom);
  return EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(dom),
    schema,
    plugins,
  });
}

const SCHEMA = createSchema();
const PLUGINS = createPlugins();
const INITIAL_EDITOR_STATE = createInitialEditorState(SCHEMA, PLUGINS);

function createEditorView(
  el: HTMLElement,
  editorState: EditorState,
  onChange: (view: EditorView) => void,
) {
  const editorView = new EditorView(el, {
    state: editorState,
    nodeViews: { ...createNodeViewsMap() },
    dispatchTransaction(tr: Transaction) {
      const newState = editorView.state.apply(tr);
      editorView.updateState(newState);
      onChange(editorView);
    },
  });
  return editorView;
}

function useEditorViewEffect(
  onChange: (view: EditorView) => void,
  initialEditorState: EditorState,
  editorParentRef: React.RefObject<HTMLElement>,
) {
  useLayoutEffect(() => {
    const el = editorParentRef.current;
    if (el) {
      const editorView = createEditorView(el, initialEditorState, onChange);
      const timer = setTimeout(() => {
        editorView.focus();
        onChange(editorView);
      }, 200);
      return () => {
        clearTimeout(timer);
        editorView.destroy();
      };
    }
  }, [onChange, initialEditorState, editorParentRef]);
}

const Editor = memo(
  (props: {
    initialEditorState: EditorState;
    onChange: (view: EditorView) => void;
  }) => {
    const { onChange, initialEditorState } = props;
    const editorParentRef = useRef<HTMLDivElement>(null);
    useEditorViewEffect(onChange, initialEditorState, editorParentRef);
    return <div className={styles.editor} ref={editorParentRef} />;
  },
);

export default function ExampleApp() {
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const onChange = useCallback((view: EditorView) => {
    setEditorView(view);
    setEditorState(view?.state || null);
  }, []);
  return (
    <div className={styles.main}>
      <Style cssModule={ExampleAppSheet} />
      <Toolbar editorView={editorView} editorState={editorState} />
      <Editor onChange={onChange} initialEditorState={INITIAL_EDITOR_STATE} />
    </div>
  );
}
