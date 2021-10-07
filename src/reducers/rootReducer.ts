import { combineReducers } from "redux";
import counterReducer from "./counterReducer";
import topUserReducer from './topUserReducer';

const rootReducer = combineReducers({ counterReducer, topUserReducer });

export default rootReducer


export type RootState = ReturnType<typeof rootReducer>