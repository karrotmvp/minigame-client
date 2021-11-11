export const UPDATE_GAME_DATA = 'karrotClickerData/UPDATE_GAME_DATA' as const;
export const SET_GAME_TYPE = 'karrotClickerData/SET_GAME_TYPE' as const;
export const UPDATE_COMMENT = 'karrotClickerData/UPDATE_COMMENT' as const;

export const updateUserGameDataAction = (score: number, rank: number) => ({
  type: UPDATE_GAME_DATA,
  payload: {
    score,
    rank,
  },
});

export const updateUserCommentAction = (comment: string) => ({
  type: UPDATE_COMMENT,
  payload: { comment },
});

export const setGameTypeAction = (gameType: 'GAME_KARROT' | 'GAME_2048') => ({
  type: SET_GAME_TYPE,
  payload: {
    gameType,
  },
});

type KarrotClickerDataAction =
  | ReturnType<typeof updateUserGameDataAction>
  | ReturnType<typeof setGameTypeAction>
  | ReturnType<typeof updateUserCommentAction>;

type KarrotClickerDataState = {
  score: number;
  rank: number;
  comment: string;
  gameType: 'GAME_KARROT' | 'GAME_2048';
};

const initialState: KarrotClickerDataState = {
  score: 0,
  rank: 0,
  comment: '',
  gameType: 'GAME_KARROT',
};

const KarrotClickerDataReducer = (
  state: KarrotClickerDataState = initialState,
  action: KarrotClickerDataAction
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

export default KarrotClickerDataReducer;
