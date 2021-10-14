// action types
export const UPDATE_USER_SCORE = 'userData/UPDATE_USER_SCORE';
export const SAVE_TOWN_ID = 'userData/SAVE_TOWN_ID;'
export const SAVE_TOWN_NAME = 'userData/SAVE_TOWN_NAME'
export const SAVE_REGION_ID = 'userData/SAVE_REGION_ID'

// actions,
export const updateUserScore = (score: number) => ({ type: UPDATE_USER_SCORE, score });
export const saveTownId = (townId: string) => ({type: SAVE_TOWN_ID, townId});
export const saveTownName = (townName: string) => ({type: SAVE_TOWN_NAME, townName});
export const saveRegionId = (regionId: string | null) => ({type: SAVE_REGION_ID, regionId});

// initial state
const initialState =  {
  score: 0,
  townId: '',
  townName: '',
  regionId: '',
}

// reducer
const userDataReducer = (state = initialState,  action: { type: any; score: number; townId:string; townName:string; regionId: string;} ) => {
  switch (action.type) {
    case UPDATE_USER_SCORE:
      return {
        ...state,
        score: action.score
      }
    case SAVE_TOWN_ID:
      return {
        ...state,
        townId: action.townId
      }
    case SAVE_TOWN_NAME: 
      return {
        ...state,
        townName: action.townName
      }
    case SAVE_REGION_ID: 
      return {
        ...state,
        regionId: action.regionId
      }
    default:
      return state;
  }
}

export default userDataReducer;