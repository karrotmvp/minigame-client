import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import user from 'redux/user/user';
import game2048DataReducer from 'reducers/game2048DataReducer';
import karrotClickerDataReducer from 'reducers/karrotClickerDataReducer';
import gameKarrotClickerReducer from 'pages/KarrotClicker/Game/reducers/gameKarrotClickerReducer';

const rootReducer = combineReducers({
  gameKarrotClickerReducer,
  game2048DataReducer,
  karrotClickerDataReducer,
  user,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
