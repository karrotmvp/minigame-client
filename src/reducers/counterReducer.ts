// action types
export const RESET = 'counter/RESET';
export const INCREMENT_CLICK_COUNT = 'counter/INCREMENT_CLICK_COUNT';
// export const UPDATE_ALREADY_PATCHED_KARROT = 'counter/UPDATE_ALREADY_PATCHED_KARROT'
// export const INCREASE_KARROT_COUNT = 'counter/INCREASE_KARROT_COUNT';
// actions
export const reset = () => ({ type: RESET });
export const incrementClickCount = () => ({ type: INCREMENT_CLICK_COUNT });
// export const updateAlreadyPatchedKarrot = (alreadyPatchedKarrot: number) => ({type: UPDATE_ALREADY_PATCHED_KARROT, karrotToPatch})
// export const increaseKarrotCount = () => ({type: INCREASE_KARROT_COUNT});

// initial state
const initialState = {
  clickCount: 0,
  // alreadyPatchedKarrot: 0,
  // karrotToPatch:0,
  // karrotCount: 0,
}

// reducer
const counterReducer = (state = initialState,  action: { type: any;}) => {
  switch (action.type) {
    case RESET:
      return initialState
    case INCREMENT_CLICK_COUNT:
      return {
        // ...state,
        clickCount: state.clickCount + 1
      };
    // case UPDATE_ALREADY_PATCHED_KARROT:
    //   return {
    //     ...state,
    //     alreadyPatchedKarrot: state.alreadyPatchedKarrot + action.karrotToPatch
    //   }
    // case INCREASE_KARROT_COUNT:
    //   return {
    //     ...state,
    //     karrotCount: state.karrotCount + 1
    //   }
    default:
      return state;
  }
}

export default counterReducer;