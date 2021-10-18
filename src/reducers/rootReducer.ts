import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import userDataReducer from './userDataReducer';

const rootReducer = combineReducers({ counterReducer, userDataReducer });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
