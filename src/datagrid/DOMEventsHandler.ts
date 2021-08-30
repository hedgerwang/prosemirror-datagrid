type DOMEvent = WheelEvent;

type EventRegistry = {
  dom: any;
  type: string;
  listener: (e: DOMEvent) => void;
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

  onClick(
    dom: HTMLElement,
    listener: (e: MouseEvent) => void,
    capture?: boolean | null,
  ) {
    this._onMouseEvent('click', dom, listener, capture);
  }

  onMouseDown(
    dom: HTMLElement,
    listener: (e: MouseEvent) => void,
    capture?: boolean | null,
  ) {
    this._onMouseEvent('mousedown', dom, listener, capture);
  }

  onWheel(
    dom: HTMLElement,
    listener: (e: WheelEvent) => void,
    capture?: boolean | null,
  ) {
    const type = 'wheel';
    const entry = { dom, type, listener, capture: !!capture };
    this._entries.push(entry);
    dom.addEventListener(type, listener, !!capture);
  }

  _onMouseEvent(
    type: 'click' | 'mousedown',
    dom: HTMLElement,
    listener: (e: MouseEvent) => void,
    capture?: boolean | null,
  ) {
    const entry = { dom, type, listener, capture: !!capture };
    this._entries.push(entry);
    dom.addEventListener(type, listener, !!capture);
  }
}
