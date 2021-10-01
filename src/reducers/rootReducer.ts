import { combineReducers } from "redux";
import increment from "./increment";

const rootReducer = combineReducers({ increment: increment });

export default rootReducer


export type RootState = ReturnType<typeof rootReducer>