// action types
export const GET_USER_SCORE = 'userData/GET_USER_SCORE';


// actions,
export const getUserScore = (score: number) => ({ type: GET_USER_SCORE, score });

// initial state
const initialState =  {
  score: 0,
}

// reducer
const userDataReducer = (state = initialState,  action: { type: any; score: any; } ) => {
  switch (action.type) {
    case GET_USER_SCORE:
      return {
        score: action.score
      }

    default:
      return state;
  }
}

export default userDataReducer;