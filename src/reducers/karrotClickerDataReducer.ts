export const UPDATE_GAME_DATA = 'karrotClickerData/UPDATE_GAME_DATA' as const;
export const SET_GAME_TYPE = 'karrotClickerData/SET_GAME_TYPE' as const;
export const updateUserGameDataAction = (
  score: number,
  rank: number,
  comment: string
) => ({
  type: UPDATE_GAME_DATA,
  payload: {
    score,
    rank,
    comment,
  },
});

export const setGameTypeAction = (gameType: string) => ({
  type: SET_GAME_TYPE,
  payload: { gameType },
});

type KarrotClickerDataAction =
  | ReturnType<typeof updateUserGameDataAction>
  | ReturnType<typeof setGameTypeAction>;

type KarrotClickerDataState = {
  score: number;
  rank: number;
  comment: string;
  gameType: string;
};

const initialState: KarrotClickerDataState = {
  score: 0,
  rank: 0,
  comment: '',
  gameType: '',
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
