// import {  createStore } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension';

// import rootReducer from './reducers/rootReducer';

// export default createStore(rootReducer, composeWithDevTools());

import { configureStore } from '@reduxjs/toolkit';

// import monitorReducersEnhancer from './enhancers/monitorReducers';
// import loggerMiddleware from './middleware/logger'
import logger from 'redux-logger';
// import rootReducer, { RootState } from './reducers/rootReducer';

import { combineReducers } from 'redux';
import userDataReducer from 'reducers/userDataReducer';
import game2048DataReducer from 'reducers/game2048DataReducer';
import karrotClickerDataReducer from 'reducers/karrotClickerDataReducer';
import gameKarrotClickerReducer from 'pages/KarrotClicker/Game/reducers/gameKarrotClickerReducer';
import user from 'redux/user/user';

const rootReducer = combineReducers({
  gameKarrotClickerReducer,
  userDataReducer,
  game2048DataReducer,
  karrotClickerDataReducer,
  user,
});

export type RootState = ReturnType<typeof rootReducer>;
// export default rootReducer;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  // preloadedState,
  // enhancers: [monitorReducersEnhancer],
});

// if (process.env.NODE_ENV !== 'production' && module.hot) {
//   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
// }

export default store;
