// action types
export const UPDATE_USER_SCORE = 'userData/UPDATE_USER_SCORE';
// export const SAVE_TOWN_ID = 'userData/SAVE_TOWN_ID;'

// actions,
export const updateUserScore = (score: number) => ({ type: UPDATE_USER_SCORE, score });
// export const saveTownId = (townId: string) => ({type: SAVE_TOWN_ID, townId});
// initial state
const initialState =  {
  score: 0,
  // townId: '',
}

// reducer
const userDataReducer = (state = initialState,  action: { type: any; score: number; } ) => {
  switch (action.type) {
    case UPDATE_USER_SCORE:
      return {
        // ...state,
        score: action.score
      }
    // case SAVE_TOWN_ID:
    //   return {
    //     ...state,
    //     townId: action.townId
    //   }
    default:
      return state;
  }
}

export default userDataReducer;