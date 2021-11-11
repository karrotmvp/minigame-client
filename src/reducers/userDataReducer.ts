// action types
export const SET_USER_INFO = 'userData/SET_USER_INFO' as const;
export const SET_REGION_INFO = 'userData/SET_REGION_INFO' as const;
export const SET_DISTRICT_INFO = 'userData/SET_DISTRICT_INFO' as const;

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

export const setDistrictInfoAction = (
  districtId: string, //id
  cityName: string, //name1
  districtName: string //name2
) => ({
  type: SET_DISTRICT_INFO,
  payload: {
    districtId,
    cityName,
    districtName,
  },
});

type UserDataAction =
  | ReturnType<typeof setUserInfoAction>
  | ReturnType<typeof setRegionInfoAction>
  | ReturnType<typeof setDistrictInfoAction>;

// initial state
type UserDataState = {
  userId: string;
  nickname: string;
  regionId: string;
  districtId: string;
  cityName: string;
  districtName: string;
};
const initialState: UserDataState = {
  userId: '',
  nickname: '',
  regionId: '',
  districtId: '',
  cityName: '',
  districtName: '',
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

    case SET_DISTRICT_INFO:
      return {
        ...state,
        districtId: action.payload.districtId,
        cityName: action.payload.cityName,
        districtName: action.payload.districtName,
      };
    default:
      return state;
  }
};

export default userDataReducer;
