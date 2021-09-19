import * as React from 'react';
import { memo } from 'react';

const Template = memo(() => {
  return (
    <>
      <h1>Hello ProseMirror</h1>
      <p>This is editable text. You can focus it and start typing.</p>
      <ol>
        <li>list item</li>
        <li>list item</li>
        <li>list item</li>
      </ol>
      <pm-data-grid />
      <p>
        To apply styling, you can select a piece of text and manipulate its
        styling from the menu. The basic schema supports emphasis, strong text,
        links, code font, and images.
      </p>

      <p>
        Try using the “list” item in the menu to wrap this paragraph in a
        numbered list.
      </p>
    </>
  );
});

export default Template;
