import * as React from 'react';
import { render } from 'react-dom';
import ExampleApp from './ExampleApp';

window.addEventListener('load', () => {
  const rootEl = document.getElementById('root');
  render(<ExampleApp />, rootEl);
}, true);

