import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import { Buffer } from 'buffer';
import App from './App.tsx';
import './index.css';

globalThis.Buffer = Buffer;

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.querySelector('#root') as HTMLElement
);
