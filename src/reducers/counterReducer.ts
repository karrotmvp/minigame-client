// action types
export const RESET = 'counter/RESET';
export const INCREMENT_CLICK_COUNT = 'counter/INCREMENT_CLICK_COUNT';

// actions
export const reset = () => ({ type: RESET });
export const incrementClickCount = () => ({ type: INCREMENT_CLICK_COUNT });

// initial state
const initialState = {
  clickCount: 0,
};

// reducer
const counterReducer = (state = initialState, action: { type: any }) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case INCREMENT_CLICK_COUNT:
      return {
        clickCount: state.clickCount + 1,
      };

    default:
      return state;
  }
};

export default counterReducer;
