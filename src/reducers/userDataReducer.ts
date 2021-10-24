// action types
export const UPDATE_ACCESS_TOKEN = 'useData/UPDATE_ACCESS_TOKEN' as const;
// export const UPDATE_USER_SCORE = 'userData/UPDATE_USER_SCORE' as const;
export const UPDATE_REGION_DATA = 'userData/UPDATE_REGION_DATA' as const;
// export const SAVE_TOWN_NAME = 'userData/SAVE_TOWN_NAME';
// export const SAVE_REGION_ID = 'userData/SAVE_REGION_ID';
export const UPDATE_USER_DATA = 'userData/UPDATE_USER_DATA' as const;
// actions,
export const updateAccessToken = (accessToken: string) => ({
  type: UPDATE_ACCESS_TOKEN,
  payload: { accessToken },
});
// export const updateUserScore = (score: number) => ({
//   type: UPDATE_USER_SCORE,
//   score,
// });
export const udpateRegionData = (
  regionId: string,
  townId: string,
  townName: string
) => ({
  type: UPDATE_REGION_DATA,
  payload: {
    regionId,
    townId,
    townName,
  },
});
// export const saveTownName = (townName: string) => ({
//   type: SAVE_TOWN_NAME,
//   townName,
// });
// export const saveRegionId = (regionId: string | null) => ({
//   type: SAVE_REGION_ID,
//   regionId,
// });
export const updateUserData = (
  id: string,
  nickname: string,
  score: number,
  rank: number,
  comment: string
) => ({
  type: UPDATE_USER_DATA,
  payload: {
    id,
    nickname,
    score,
    rank,
    comment,
  },
});

type UserDataAction =
  | ReturnType<typeof updateAccessToken>
  | ReturnType<typeof udpateRegionData>
  | ReturnType<typeof updateUserData>;

// initial state
type UserDataState = {
  accessToken: string;
  id: string;
  nickname: string;
  score: number;
  rank: number;
  comment: string;
  townId: string;
  townName: string;
  regionId: string;
};
const initialState: UserDataState = {
  accessToken: window.localStorage.getItem('ACCESS_TOKEN')!,
  id: '',
  nickname: '',
  score: 0,
  rank: 0,
  comment: '',
  townId: '',
  townName: '',
  regionId: '',
};

// reducer
const userDataReducer = (
  state: UserDataState = initialState,
  action: UserDataAction
) => {
  switch (action.type) {
    case UPDATE_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case UPDATE_REGION_DATA:
      return {
        ...state,
        regionId: action.payload.regionId,
        townId: action.payload.townId,
        townName: action.payload.townName,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        id: action.payload.id,
        nickname: action.payload.nickname,
        score: action.payload.score,
        rank: action.payload.rank,
        comment: action.payload.comment,
      };

    // case UPDATE_USER_SCORE:
    //   return {
    //     ...state,
    //     score: action.score,
    //   };
    // case SAVE_TOWN_ID:
    //   return {
    //     ...state,
    //     townId: action.townId,
    //   };
    // case SAVE_TOWN_NAME:
    //   return {
    //     ...state,
    //     townName: action.townName,
    //   };
    // case SAVE_REGION_ID:
    //   return {
    //     ...state,
    //     regionId: action.regionId,
    //   };
    default:
      return state;
  }
};

export default userDataReducer;
