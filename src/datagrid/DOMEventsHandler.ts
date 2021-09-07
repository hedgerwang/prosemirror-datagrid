type WheeListener = (e: WheelEvent) => void;
type MouseListener = (e: MouseEvent) => void;
type KeyboardListener = (e: KeyboardEvent) => void;

type EventRegistry = {
  dom: any;
  type: string;
  listener: WheeListener | MouseListener | KeyboardListener;
  capture: boolean;
};

export default class DOMEventsHandler {
  _entries: EventRegistry[];

  constructor() {
    this._entries = [];
  }

  destroy() {
    this._entries.forEach((entry) => {
      const { dom, type, capture, listener } = entry;
      dom.removeEventListener(type, listener, capture);
    });
  }

  onClick(dom: HTMLElement, listener: MouseListener, capture?: boolean | null) {
    this._onMouseEvent('click', dom, listener, capture);
  }

  onMouseDown(
    dom: HTMLElement,
    listener: MouseListener,
    capture?: boolean | null,
  ) {
    this._onMouseEvent('mousedown', dom, listener, capture);
  }

  onKeyDown(
    dom: HTMLElement,
    listener: KeyboardListener,
    capture?: boolean | null,
  ) {
    this._onKeyboardEvent('keydown', dom, listener, capture);
  }

  onWheel(dom: HTMLElement, listener: WheeListener, capture?: boolean | null) {
    const type = 'wheel';
    const entry = { dom, type, listener, capture: !!capture };
    this._entries.push(entry);
    dom.addEventListener(type, listener, !!capture);
  }

  _onMouseEvent(
    type: 'click' | 'mousedown',
    dom: HTMLElement,
    listener: MouseListener,
    capture?: boolean | null,
  ) {
    const entry = { dom, type, listener, capture: !!capture };
    this._entries.push(entry);
    dom.addEventListener(type, listener, !!capture);
  }

  _onKeyboardEvent(
    type: 'keydown',
    dom: HTMLElement,
    listener: KeyboardListener,
    capture?: boolean | null,
  ) {
    const entry = { dom, type, listener, capture: !!capture };
    this._entries.push(entry);
    dom.addEventListener(type, listener, !!capture);
  }
}
