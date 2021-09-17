import * as React from 'react';
import { memo } from 'react';
import styles from './ToolBar.css';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, undoDepth, redoDepth } from 'prosemirror-history';

function Button(
  props: {
    children: JSX.Element | string | null;
    disabled?: boolean | undefined;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { disabled, children, onClick } = props;
  return (
    <button className={styles.button} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function UndoButton(props: {
  editorView: EditorView | null;
  editorState: EditorState | null;
}) {
  const { editorState, editorView } = props;
  const onClick = () => {
    if (editorState && editorView) {
      undo(editorState, editorView.dispatch);
    }
  };
  const disabled = !editorState || !editorView || !undoDepth(editorState);
  return (
    <Button disabled={disabled} onClick={onClick}>
      undo
    </Button>
  );
}

function RedoButton(props: {
  editorView: EditorView | null;
  editorState: EditorState | null;
}) {
  const { editorState, editorView } = props;
  const onClick = () => {
    if (editorState && editorView) {
      redo(editorState, editorView.dispatch);
    }
  };
  const disabled = !editorState || !editorView || !redoDepth(editorState);
  return (
    <Button disabled={disabled} onClick={onClick}>
      undo
    </Button>
  );
}

function Toolbar(props: {
  editorView: EditorView | null;
  editorState: EditorState | null;
}) {
  const { editorState, editorView } = props;

  return (
    <div className={styles.toolBar}>
      <div className={styles.toolBarRow}>
        <UndoButton {...props} />
        <RedoButton {...props} />
      </div>
      <div className={styles.toolBarRuler} />
    </div>
  );
}

export default memo(Toolbar);
