// action types

export const SET_TOWN_INFO = 'userData/SET_TOWN_INFO' as const;

// actions,

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

type UserDataAction = ReturnType<typeof setTownInfoAction>;

// initial state
type UserDataState = {
  townId: string;
  townName1: string;
  townName2: string;
  townName3: string;
};
const initialState: UserDataState = {
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
