import nullthrows from 'nullthrows';

const NODE_NAME = 'pm-data-grid';

function defineElement() {
  if (!customElements.get(NODE_NAME)) {
    customElements.define(NODE_NAME, ProseMirrorDataGridElement);
  }
}

function createElement(doc: Document): ProseMirrorDataGridElement {
  defineElement();
  return doc.createElement(NODE_NAME);
}

export default class ProseMirrorDataGridElement extends HTMLElement {
  static NODE_NAME = NODE_NAME;
  static defineElement = defineElement;
  static createElement = createElement;

  constructor() {
    super();
  }
}
