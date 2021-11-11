// action types
export const RESET = 'gameKarrotClicker/RESET' as const;
export const INCREMENT_CLICK_COUNT =
  'gameKarrotClicker/INCREMENT_CLICK_COUNT' as const;
export const UPDATE_ANIMATION_PLAY_STATE =
  'gameKarrotClicker/UPDATE_ANIMATION_PLAY_STATE' as const;
export const UPDATE_PAUSE_STATE =
  'gameKarrotClicker/UPDATE_PAUSE_STATE' as const;
// actions
export const reset = () => ({
  type: RESET,
});
export const incrementClickCountAction = () => ({
  type: INCREMENT_CLICK_COUNT,
});
export const updateAnimationPlayStateAction = (animationPlayState: string) => ({
  type: UPDATE_ANIMATION_PLAY_STATE,
  payload: {
    animationPlayState,
  },
});
export const updatePauseStateAction = (pauseState: boolean) => ({
  type: UPDATE_PAUSE_STATE,
  payload: {
    pauseState,
  },
});
type GameKarrotClickerAction =
  | ReturnType<typeof reset>
  | ReturnType<typeof incrementClickCountAction>
  | ReturnType<typeof updateAnimationPlayStateAction>
  | ReturnType<typeof updatePauseStateAction>;

type GameKarrotClickerState = {
  clickCount: number;
  animationPlayState: string;
  pauseState: boolean;
};

// initial state
const initialState = {
  clickCount: 0,
  animationPlayState: '',
  pauseState: false,
};

// reducer
const gameKarrotClickerReducer = (
  state: GameKarrotClickerState = initialState,
  action: GameKarrotClickerAction
) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case INCREMENT_CLICK_COUNT:
      return {
        ...state,
        clickCount: state.clickCount + 1,
      };
    case UPDATE_ANIMATION_PLAY_STATE:
      return {
        ...state,
        animationPlayState: action.payload.animationPlayState,
      };
    case UPDATE_PAUSE_STATE:
      return {
        ...state,
        pauseState: action.payload.pauseState,
      };
    default:
      return state;
  }
};

export default gameKarrotClickerReducer;
