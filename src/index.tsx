import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'index.css';
import App from './App';
import store from './store';
import { logEvent } from 'firebase/analytics';
import { analytics } from 'services/firebase/firebaseConfig';

logEvent(analytics, 'notification_received');

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
