// action types
export const ADD = 'userData/ADD';
export const UPDATE_SCORE = 'userData/UPDATE_SCORE';

// // actions,
export const addData = (nickname: string, score: number, rank: any, comment: string,) => ({ type: ADD, nickname, score, rank, comment });
export const updateScore = (score:number) => ({ type: UPDATE_SCORE, score });
// initial state
const initialState =  {
  nickname: "",
  score: 0,
  rank: null,
  comment: "",
  // town: {
  //     id: "9bdfe83b68f3",
  //     name1: "서울특별시",
  //     name2: "강남구"
  // }
}

// reducer
const userDataReducer = (state = initialState,  action: { type: any; nickname: string, score: number, rank: any, comment: string,} ) => {
  switch (action.type) {
    case ADD:
      return {
        nickname: action.nickname,
        score: action.score,
        rank: action.rank,
        comment: action.comment,
      }
    case UPDATE_SCORE:
      return {
        ...state,
        score: action.score + state.score
      }

    default:
      return state;
  }
}

export default userDataReducer;