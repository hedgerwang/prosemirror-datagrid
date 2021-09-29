export type ImportedCSSModule = {
  locals: Object;
  toString: () => string;
};

export default function createStyleElement(
  cssModule: ImportedCSSModule,
): HTMLStyleElement {
  const el = document.createElement('style');
  const cssText = cssModule.toString();
  el.appendChild(document.createTextNode(cssText));
  return el;
}
