// action types
export const UPDATE_ACCESS_TOKEN = 'useData/UPDATE_ACCESS_TOKEN' as const;
export const UPDATE_REGION_DATA = 'userData/UPDATE_REGION_DATA' as const;
export const UPDATE_USER_DATA = 'userData/UPDATE_USER_DATA' as const;
// actions,
export const updateAccessToken = (accessToken: string) => ({
  type: UPDATE_ACCESS_TOKEN,
  payload: { accessToken },
});

export const updateRegionData = (
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
  | ReturnType<typeof updateRegionData>
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
      // console.log('in redux reducer', action.payload.regionId);
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
    default:
      return state;
  }
};

export default userDataReducer;
