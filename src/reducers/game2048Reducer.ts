import { TileProps } from '../pages/Game2048/Game/Tile';
// action types
export const CREATE_TILE = 'game2048/CREATE_TILE' as const;
export const UPDATE_TILE = 'game2048/UPDATE_TILE' as const;
export const MERGE_TILE = 'game2048/MERGE_TILE' as const;
export const MOVE_START = 'game2048/MOVE_START' as const;
export const MOVE_END = 'game2048/MOVE_END' as const;
export const UPDATE_SCORE = 'game2048/UPDATE_SCORE' as const;
// actions
export const createTileAction = (tile: TileProps) => ({
  type: CREATE_TILE,
  payload: { tile },
});
export const updateTileAction = (tile: TileProps) => ({
  type: UPDATE_TILE,
  payload: { tile },
});
export const mergeTileAction = (source: TileProps, destination: TileProps) => ({
  type: MERGE_TILE,
  payload: { source, destination },
});
export const moveStartAction = () => ({ type: MOVE_START });
export const moveEndAction = () => ({ type: MOVE_END });
export const updateScoreAction = (score: number) => ({
  type: UPDATE_SCORE,
  payload: { score },
});
type GameAction =
  | ReturnType<typeof createTileAction>
  | ReturnType<typeof updateTileAction>
  | ReturnType<typeof mergeTileAction>
  | ReturnType<typeof moveStartAction>
  | ReturnType<typeof moveEndAction>
  | ReturnType<typeof updateScoreAction>;

export type GameState = {
  tiles: {
    [id: number]: TileProps;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
  score: number;
  // totalScore: number;
};

export const initialState: GameState = {
  tiles: {},
  byIds: [],
  hasChanged: false,
  inMotion: false,
  score: 0,
  // totalScore: 0,
};

// export type GameAction =
//   | { type: 'create_tile'; tile: TileProps }
//   | { type: 'update_tile'; tile: TileProps }
//   | { type: 'merge_tile'; source: TileProps; destination: TileProps }
//   | { type: 'update_score'; score: number }
//   | { type: 'reset_score' }
//   | { type: 'move_start' }
//   | { type: 'move_end' };

const game2048Reducer = (
  state: GameState = initialState,
  action: GameAction
) => {
  switch (action.type) {
    case CREATE_TILE:
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.payload.tile.id]: action.payload.tile,
        },
        byIds: [...state.byIds, action.payload.tile.id],
        hasChanged: false,
      };
    case UPDATE_TILE:
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.payload.tile.id]: action.payload.tile,
        },
        hasChanged: true,
      };
    case MERGE_TILE:
      const {
        [action.payload.source.id]: source,
        [action.payload.destination.id]: destination,
        ...restTiles
      } = state.tiles;
      return {
        ...state,
        tiles: {
          ...restTiles,
          [action.payload.destination.id]: {
            id: action.payload.destination.id,
            value:
              action.payload.source.value + action.payload.destination.value,
            coordinate: action.payload.destination.coordinate,
          },
        },
        byIds: state.byIds.filter((id) => id !== action.payload.source.id),
        hasChanged: true,
      };
    case UPDATE_SCORE:
      // console.log(state.score, action.score);
      return {
        ...state,
        score: state.score + action.payload.score,
      };
    // case 'reset_score':
    //   return {
    //     ...state,
    //     score: 0,
    //   };
    case MOVE_START:
      return {
        ...state,
        inMotion: true,
      };
    case MOVE_END:
      return {
        ...state,
        inMotion: false,
      };
    default:
      return state;
  }
};

export default game2048Reducer;
