// action types
export const RESET = 'counter/RESET';
export const INCREASE = 'counter/INCREASE';
export const INCREASE_KARROT_COUNT = 'counter/INCREASE_KARROT_COUNT';
// actions
export const increase = () => ({ type: INCREASE });
export const reset = () => ({ type: RESET });
export const increaseKarrotCount = () => ({type: INCREASE_KARROT_COUNT});

// initial state
const initialState = {
  clickCount: 0,
  karrotCount: 0,
}

// reducer
const counterReducer = (state = initialState,  action: { type: any; }) => {
  switch (action.type) {
    case RESET:
      return initialState
    case INCREASE:
      return {
        ...state,
        clickCount: state.clickCount + 1
      };
    case INCREASE_KARROT_COUNT:
      return {
        ...state,
        karrotCount: state.karrotCount + 1
      }
    default:
      return state;
  }
}

export default counterReducer;