// action types
export const RESET = 'counter/RESET';
export const INCREASE = 'counter/INCREASE';

// actions
export const increase = () => ({ type: INCREASE });
export const reset = () => ({ type: RESET });

// initial state
const initialState = {
  score: 0,
}

// reducer
const counterReducer = (state = initialState,  action: { type: any; }) => {
  switch (action.type) {
    case RESET:
      return initialState
    case INCREASE:
      return {
        score: state.score + 1
      };

    default:
      return state;
  }
}

export default counterReducer;