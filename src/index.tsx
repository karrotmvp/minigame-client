import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MinigameApiProvider } from 'services/api/minigameApi';
import store from 'store';
import App from './App';
import './index.css';
ReactDOM.render(
  <React.StrictMode>
<<<<<<< Updated upstream
    <Provider store={store}>
      <App />
    </Provider>
=======
    <CookiesProvider>
      <Provider store={store}>
        <MinigameApiProvider>
          <App />
        </MinigameApiProvider>
      </Provider>
    </CookiesProvider>
>>>>>>> Stashed changes
  </React.StrictMode>,
  document.getElementById('root')
);
