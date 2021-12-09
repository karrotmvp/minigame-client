// action types
export const SET_USER_INFO = 'userData/SET_USER_INFO' as const;
export const SET_REGION_INFO = 'userData/SET_REGION_INFO' as const;
export const SET_TOWN_INFO = 'userData/SET_TOWN_INFO' as const;
export const SET_IS_INSTALLED = 'userData/SET_IS_INSTALLED' as const;

// actions,
export const setUserInfoAction = (userId: string, nickname: string) => ({
  type: SET_USER_INFO,
  payload: {
    userId,
    nickname,
  },
});

export const setRegionInfoAction = (regionId: string) => ({
  type: SET_REGION_INFO,
  payload: {
    regionId,
  },
});

export const setTownInfoAction = (
  townId: string,
  townName1: string,
  townName2: string,
  townName3: string
) => ({
  type: SET_TOWN_INFO,
  payload: {
    townId,
    townName1,
    townName2,
    townName3,
  },
});

type UserDataAction =
  | ReturnType<typeof setUserInfoAction>
  | ReturnType<typeof setRegionInfoAction>
  | ReturnType<typeof setTownInfoAction>;

// initial state
type UserDataState = {
  userId: string;
  nickname: string;
  regionId: string;
  townId: string;
  townName1: string;
  townName2: string;
  townName3: string;
};
const initialState: UserDataState = {
  userId: '',
  nickname: '',
  regionId: '',
  townId: '',
  townName1: '',
  townName2: '',
  townName3: '',
};

// reducer
const userDataReducer = (
  state: UserDataState = initialState,
  action: UserDataAction
) => {
  switch (action.type) {
    case SET_USER_INFO:
      return {
        ...state,
        userId: action.payload.userId,
        nickname: action.payload.nickname,
      };
    case SET_REGION_INFO:
      return {
        ...state,
        regionId: action.payload.regionId,
      };

    case SET_TOWN_INFO:
      return {
        ...state,
        townId: action.payload.townId,
        townName1: action.payload.townName1,
        townName2: action.payload.townName2,
        townName3: action.payload.townName3,
      };

    default:
      return state;
  }
};

export default userDataReducer;
