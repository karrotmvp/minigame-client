import { combineReducers } from "redux";
import counterReducer from "./counterReducer";
// import topUserReducer from './topUserReducer';
// import userDataReducer from './userDataReducer'

const rootReducer = combineReducers({ counterReducer });

export default rootReducer


export type RootState = ReturnType<typeof rootReducer>