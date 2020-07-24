import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from 'config/default.json';

const reactElement = config.React.isStrictMode ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);

const rootElement = document.getElementById('root');

// http://reactcommunity.org/react-modal/accessibility/
Modal.setAppElement(rootElement);

ReactDOM.render(reactElement, rootElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
