import nullthrows from 'nullthrows';
import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import ExampleApp from '../src/examples/ExampleApp';

describe('App', () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement('div');
    nullthrows(document.body).appendChild(container);
  });

  afterEach(() => {
    nullthrows(container).remove();
    container = null;
  });

  it('App is rendered', () => {
    // Test first render and componentDidMount
    const el = nullthrows(container);
    act(() => {
      render(<ExampleApp />, el);
    });
    // TODO: expect it renders something.
    // expect(el.textContent).toContain('yahoo');
  });
});
