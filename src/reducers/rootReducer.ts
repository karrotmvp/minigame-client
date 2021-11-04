import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import userDataReducer from './userDataReducer';
import game2048Reducer from './game2048Reducer';

const rootReducer = combineReducers({
  counterReducer,
  userDataReducer,
  game2048Reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
