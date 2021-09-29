import * as React from 'react';
import { memo, useContext, createContext } from 'react';
import ToolbarSheet from './Toolbar.css';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, undoDepth, redoDepth } from 'prosemirror-history';
import { toggleMark } from 'prosemirror-commands';
import Style from './Style';
import { Fragment, Schema } from 'prosemirror-model';

type ToolbarProps = {
  editorView: EditorView | null;
  editorState: EditorState | null;
};

const styles = ToolbarSheet.locals;

const ToolbarContext = createContext({
  editorView: null,
  editorState: null,
} as ToolbarProps);

function useToolbar() {
  return useContext(ToolbarContext);
}

function focusElement(el: Element) {
  if (el instanceof HTMLElement) {
    el.focus();
  }
}

// link, em, strong, code
function useToggleMark(markName: string) {
  const { editorState, editorView } = useToolbar();
  let onClick = undefined;
  let active = false;
  if (
    editorState &&
    editorView &&
    editorState.selection instanceof TextSelection &&
    !editorState.selection.empty &&
    editorState.schema.marks[markName]
  ) {
    const markType = editorState.schema.marks[markName];
    const { from, to } = editorState.selection;
    editorState.doc.nodesBetween(from, to, (node, pos) => {
      const { marks } = node;
      if (!active && Array.isArray(marks)) {
        active = !!marks.find((mark) => mark.type === markType);
      }
      return !active;
    });

    onClick = () => {
      toggleMark(markType)(editorState, (tr) => {
        focusElement(editorView.dom);
        editorView.dispatch(tr);
      });
    };
  }
  return {
    active,
    disabled: !onClick,
    onClick,
  };
}

// doc, paragraph, blockquote, horizontal_rule, heading, code_block, text,
// image, hard_break, ordered_list, bullet_list, list_item, datagrid
function useToggleHeadingLevel(level: number) {
  const { editorState, editorView } = useToolbar();
  let onClick = undefined;
  let active = false;
  let disabled = false;
  if (
    editorState &&
    editorView &&
    editorState.selection instanceof TextSelection &&
    editorState.schema.nodes['heading'] &&
    editorState.schema.nodes['paragraph']
  ) {
    const heading = editorState.schema.nodes['heading'];
    const paragraph = editorState.schema.nodes['paragraph'];
    const { from, to } = editorState.selection;
    editorState.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isBlock) {
        if (!disabled && node.type !== paragraph && node.type !== heading) {
          disabled = true;
        }
        if (node.type === heading && node.attrs.level === level) {
          active = true;
        }
      }
      return true;
    });

    if (!disabled) {
      onClick = () => {
        let tr = editorState.tr;
        editorState.doc.nodesBetween(from, to, (node, pos) => {
          if (node.isBlock) {
            if (node.type === heading && node.attrs.level === level) {
              const { level, ...attrs } = node.attrs;
              tr = tr.setNodeMarkup(pos, paragraph, attrs, node.marks);
            } else {
              tr = tr.setNodeMarkup(
                pos,
                heading,
                { ...node.attrs, level },
                node.marks,
              );
            }
          }
          return true;
        });
        if (tr.docChanged) {
          focusElement(editorView.dom);
          editorView.dispatch(tr);
        }
      };
    }
  }
  return {
    active,
    disabled,
    onClick,
  };
}

function Button(
  props: {
    active?: boolean | undefined;
    children: JSX.Element | string | null;
    disabled?: boolean | undefined;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { active, disabled, children, onClick } = props;
  let className = styles.button;

  if (active) {
    className += ' ' + styles.active;
  }

  if (disabled) {
    className += ' ' + styles.disabled;
  }

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

function Bold() {
  const { active, disabled, onClick } = useToggleMark('strong');
  return (
    <Button active={active} disabled={disabled} onClick={onClick}>
      Bold
    </Button>
  );
}

function Italic() {
  const { active, disabled, onClick } = useToggleMark('em');
  return (
    <Button active={active} disabled={disabled} onClick={onClick}>
      Italic
    </Button>
  );
}

function Code() {
  const { active, disabled, onClick } = useToggleMark('code');
  return (
    <Button active={active} disabled={disabled} onClick={onClick}>
      Code
    </Button>
  );
}

function Heading(props: { level: number }) {
  const { level } = props;
  const { active, disabled, onClick } = useToggleHeadingLevel(level);
  return (
    <Button active={active} disabled={disabled} onClick={onClick}>
      {`H${String(level)}`}
    </Button>
  );
}

function Undo() {
  const { editorState, editorView } = useToolbar();
  const onClick = () => {
    if (editorState && editorView) {
      undo(editorState, editorView.dispatch);
    }
  };
  const disabled = !editorState || !editorView || !undoDepth(editorState);
  return (
    <Button disabled={disabled} onClick={onClick}>
      Undo
    </Button>
  );
}

function Redo() {
  const { editorState, editorView } = useToolbar();
  const onClick = () => {
    if (editorState && editorView) {
      redo(editorState, editorView.dispatch);
    }
  };
  const disabled = !editorState || !editorView || !redoDepth(editorState);
  return (
    <Button disabled={disabled} onClick={onClick}>
      Redo
    </Button>
  );
}

function Test() {
  const { editorState, editorView } = useToolbar();
  const onClick = () => {
    if (editorState && editorView) {
      focusElement(editorView.dom);

      const contents = [];
      const paragraphType = editorState.schema.nodes.paragraph;

      for (let ii = 0; ii < 5; ii++) {
        const textNode = editorState.schema.text(
          'hello ' +
            Math.round(Math.random() * 100)
              .toString(16)
              .toUpperCase(),
        );
        const paragraphNode = paragraphType.create({}, Fragment.from(textNode));
        contents.push(paragraphNode);
      }

      const insertTo = editorState.selection.to;
      const fragment = Fragment.from(contents);
      const tr = editorState.tr.insert(editorState.selection.to, fragment);
      const selection = TextSelection.create(tr.doc, insertTo + fragment.size);
      editorView.dispatch(tr.setSelection(selection));
    }
  };
  return <Button onClick={onClick}>Insert Texts</Button>;
}

function ButtonsGroup(props: { children: JSX.Element | JSX.Element[] }) {
  const { children } = props;
  return <span className={styles.buttonsGroup}>{children}</span>;
}

function Toolbar(props: {
  editorView: EditorView | null;
  editorState: EditorState | null;
}) {
  return (
    <div className={styles.toolbar}>
      <Style cssModule={ToolbarSheet} />
      <div className={styles.toolbarRow}>
        <ToolbarContext.Provider value={props}>
          <ButtonsGroup>
            <Undo />
            <Redo />
          </ButtonsGroup>
          <ButtonsGroup>
            <Italic />
            <Code />
            <Bold />
          </ButtonsGroup>
          <ButtonsGroup>
            <Heading level={1} />
            <Heading level={2} />
            <Heading level={3} />
            <Heading level={4} />
            <Heading level={5} />
            <Heading level={6} />
          </ButtonsGroup>
          <ButtonsGroup>
            <Test />
          </ButtonsGroup>
        </ToolbarContext.Provider>
      </div>
      <div className={styles.toolbarRuler} />
    </div>
  );
}

export default memo(Toolbar);
