// action types
export const UPDATE_USER_SCORE = 'userData/UPDATE_USER_SCORE';
export const SAVE_TOWN_ID = 'userData/SAVE_TOWN_ID';
export const SAVE_TOWN_NAME = 'userData/SAVE_TOWN_NAME';
export const SAVE_REGION_ID = 'userData/SAVE_REGION_ID';
export const UPDATE_USER_DATA = 'userData/UPDATE_USER_DATA';
// actions,
export const updateUserScore = (score: number) => ({
  type: UPDATE_USER_SCORE,
  score,
});
export const saveTownId = (townId: string) => ({ type: SAVE_TOWN_ID, townId });
export const saveTownName = (townName: string) => ({
  type: SAVE_TOWN_NAME,
  townName,
});
export const saveRegionId = (regionId: string | null) => ({
  type: SAVE_REGION_ID,
  regionId,
});
export const updateUserData = (
  nickname: any,
  score: any,
  rank: any,
  comment: any
) => ({
  type: UPDATE_USER_DATA,
  nickname,
  score,
  rank,
  comment,
});

// initial state
const initialState = {
  nickname: '이웃',
  score: 0,
  rank: 999,
  comment: '',

  townId: '',
  townName: '',
  regionId: '',
};

// reducer
const userDataReducer = (
  state = initialState,
  action: {
    type: any;
    nickname: string;
    score: number;
    rank: number;
    comment: string;
    townId: string;
    townName: string;
    regionId: string;
  }
) => {
  switch (action.type) {
    case UPDATE_USER_DATA:
      return {
        ...state,
        nickname: action.nickname,
        score: action.score,
        rank: action.rank,
        comment: action.comment,
      };
    case UPDATE_USER_SCORE:
      return {
        ...state,
        score: action.score,
      };
    case SAVE_TOWN_ID:
      return {
        ...state,
        townId: action.townId,
      };
    case SAVE_TOWN_NAME:
      return {
        ...state,
        townName: action.townName,
      };
    case SAVE_REGION_ID:
      return {
        ...state,
        regionId: action.regionId,
      };
    default:
      return state;
  }
};

export default userDataReducer;
