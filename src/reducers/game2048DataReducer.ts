export const UPDATE_GAME_DATA = 'game2048Data/UPDATE_GAME_DATA' as const;
export const SET_GAME_TYPE = 'game2048Data/SET_GAME_TYPE' as const;
export const UPDATE_COMMENT = 'game2048Data/UPDATE_COMMENT' as const;

// Actions
export const updateUserGameDataAction = (score: number, rank: number) => ({
  type: UPDATE_GAME_DATA,
  payload: {
    score,
    rank,
  },
});

export const updateMyCommentAction = (comment: string) => ({
  type: UPDATE_COMMENT,
  payload: {
    comment,
  },
});

export const setGameTypeAction = (gameType: 'GAME_KARROT' | 'GAME_2048') => ({
  type: SET_GAME_TYPE,
  payload: {
    gameType,
  },
});

type Game2048DataAction =
  | ReturnType<typeof updateUserGameDataAction>
  | ReturnType<typeof setGameTypeAction>
  | ReturnType<typeof updateMyCommentAction>;

type Game2048DataState = {
  score: number;
  rank: number;
  comment: string;
  gameType: 'GAME_KARROT' | 'GAME_2048';
};

const initialState: Game2048DataState = {
  score: 0,
  rank: 0,
  comment: '',
  gameType: 'GAME_2048',
};

const game2048DataReducer = (
  state: Game2048DataState = initialState,
  action: Game2048DataAction
) => {
  switch (action.type) {
    case UPDATE_GAME_DATA:
      return {
        ...state,
        score: action.payload.score,
        rank: action.payload.rank,
      };
    case UPDATE_COMMENT:
      return {
        ...state,
        comment: action.payload.comment,
      };
    case SET_GAME_TYPE:
      return {
        ...state,
        gameType: action.payload.gameType,
      };
    default:
      return state;
  }
};

export default game2048DataReducer;
