import { INCREASE } from "../actions/actionTypes";

const initialState = {
  score: 0,
}

export default function increment(state = initialState, action: { type: any; }) {
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        score: state.score + 1
      };

    default:
      return state;
  }
}