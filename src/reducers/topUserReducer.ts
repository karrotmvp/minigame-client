// action types
export const RESET = 'topUser/RESET';
export const CHANGE_INPUT_TEXT = 'topUser/CHANGE_INPUT_TEXT';

// actions,
export const changeTopUserComment = (text: string) => ({ type: CHANGE_INPUT_TEXT, text });

// initial state
const initialState = {
  topUserComment: '',
}

// reducer
const topUserReducer = (state = initialState,  action: { type: any; text: string; }) => {
  switch (action.type) {
    case RESET:
      return initialState
    case CHANGE_INPUT_TEXT:
      return {
        topUserComment: action.text
      };

    default:
      return state;
  }
}

export default topUserReducer;