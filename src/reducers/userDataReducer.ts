// action types
// export const ADD_NICKNAME = 'userData/ADD_NICKNAME';
// export const ADD_SCORE = 'userData/ADD_SCORE';
// export const ADD_RANK = 'userData/ADD_RANK';
// export const ADD_COMMENT = 'userData/ADD_COMMENT';
export const ADD = 'userData/ADD';
// // actions,
// export const addNickname = (nickname: string)=> ({ type: ADD_NICKNAME, nickname});
// export const addScore = (score: number) => ({ type: ADD_SCORE, score });
// export const addRank = (rank: number | null) => ({ type: ADD_RANK, rank });
// export const addComment = (comment: string) => ({ type: ADD_COMMENT, comment });
export const addData = (nickname: string, score: number,) => ({ type: ADD, nickname, score });
// initial state
const initialState =  {
  nickname: "Neil",
  score: 0,
  // rank: null,
  // comment: "",
  // town: {
  //     id: "9bdfe83b68f3",
  //     name1: "서울특별시",
  //     name2: "강남구"
  // }
}

// interface PayloadType {
//   type: any;
//   nickname: string;
//   score: number;
//   rank: number | null;
//   comment: string

// }
// reducer
const userDataReducer = (state = initialState,  action: { type: any; nickname:string, score: number} ) => {
  switch (action.type) {
    case ADD:
      return {
        nickname: action.nickname,
        score: action.score,
        
      }

    default:
      return state;
  }
}

export default userDataReducer;