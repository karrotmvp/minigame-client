import { INCREASE } from "../actions/actionTypes";

const initialState = {
  number: 0,
  diff: 1,
}

export default function increment(state = initialState, action: { type: any; }) {
  switch (action.type) {
    case INCREASE:
      return {
        ...state,
        number: state.number + 1
      };

    default:
      return state;
  }
}