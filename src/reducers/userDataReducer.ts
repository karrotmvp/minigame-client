// action types
export const UPDATE_USER_SCORE = 'userData/UPDATE_USER_SCORE';


// actions,
export const updateUserScore = (score: number) => ({ type: UPDATE_USER_SCORE, score });

// initial state
const initialState =  {
  score: 0,
}

// reducer
const userDataReducer = (state = initialState,  action: { type: any; score: any; } ) => {
  switch (action.type) {
    case UPDATE_USER_SCORE:
      return {
        score: action.score
      }

    default:
      return state;
  }
}

export default userDataReducer;