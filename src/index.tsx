import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import store from 'store';
import { MinigameApiProvider } from 'services/api/minigameApi';
import { AnalyticsProvider } from 'services/analytics/firebase';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <MinigameApiProvider>
          <AnalyticsProvider>
            <App />
          </AnalyticsProvider>
        </MinigameApiProvider>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
