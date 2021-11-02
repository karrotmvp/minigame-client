// action types
export const RESET = 'counter/RESET' as const;
export const INCREMENT_CLICK_COUNT = 'counter/INCREMENT_CLICK_COUNT' as const;

// actions
export const reset = () => ({ type: RESET });
export const incrementClickCount = () => ({ type: INCREMENT_CLICK_COUNT });

type CounterAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof incrementClickCount>;

type CounterState = {
  clickCount: number;
};
// initial state
const initialState = {
  clickCount: 0,
};

// reducer
const counterReducer = (
  state: CounterState = initialState,
  action: CounterAction
) => {
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
