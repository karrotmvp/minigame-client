import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './KarrotClicker/reducers/rootReducer';

export default createStore(rootReducer, composeWithDevTools());
