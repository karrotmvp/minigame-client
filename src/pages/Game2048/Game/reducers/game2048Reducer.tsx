import type { TileProps } from '../Game/Tile';
// action types
export const RESET = 'game2048/RESET' as const;
export const CREATE_TILE = 'game2048/CREATE_TILE' as const;
export const UPDATE_TILE = 'game2048/UPDATE_TILE' as const;
export const MERGE_TILE = 'game2048/MERGE_TILE' as const;
export const MOVE_START = 'game2048/MOVE_START' as const;
export const MOVE_END = 'game2048/MOVE_END' as const;
export const UPDATE_SCORE = 'game2048/UPDATE_SCORE' as const;
export const SET_GAME_DATA = 'game2048/SET_GAME_DATA' as const;
// actions
export const resetGameAction = () => ({
  type: RESET,
});
export const createTileAction = (tile: TileProps) => ({
  type: CREATE_TILE,
  payload: {
    tile,
  },
});
export const updateTileAction = (tile: TileProps) => ({
  type: UPDATE_TILE,
  payload: {
    tile,
  },
});
export const mergeTileAction = (source: TileProps, destination: TileProps) => ({
  type: MERGE_TILE,
  payload: {
    source,
    destination,
  },
});
export const moveStartAction = () => ({
  type: MOVE_START,
});
export const moveEndAction = () => ({
  type: MOVE_END,
});
export const updateScoreAction = (score: number) => ({
  type: UPDATE_SCORE,
  payload: {
    score,
  },
});
export const setGameDataAction = (
  tiles: {
    [id: number]: TileProps;
  },
  byIds: number[],
  score: number,
  startId: number
) => ({
  type: SET_GAME_DATA,
  payload: {
    tiles,
    byIds,
    score,
    startId,
  },
});
type Game2048Action =
  | ReturnType<typeof resetGameAction>
  | ReturnType<typeof createTileAction>
  | ReturnType<typeof updateTileAction>
  | ReturnType<typeof mergeTileAction>
  | ReturnType<typeof moveStartAction>
  | ReturnType<typeof moveEndAction>
  | ReturnType<typeof updateScoreAction>
  | ReturnType<typeof setGameDataAction>;

export type Game2048State = {
  tiles: {
    [id: number]: TileProps;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
  score: number;
  startId: number;
};

export const initialState: Game2048State = {
  tiles: {},
  byIds: [],
  hasChanged: false,
  inMotion: false,
  score: 0,
  startId: 1,
};

export const game2048Reducer = (
  state: Game2048State = initialState,
  action: Game2048Action
) => {
  switch (action.type) {
    case RESET:
      return initialState;
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
      return {
        ...state,
        score: state.score + action.payload.score,
      };
    case SET_GAME_DATA:
      return {
        tiles: action.payload.tiles,
        byIds: action.payload.byIds,
        score: action.payload.score,
        hasChanged: false,
        inMotion: false,
        startId: action.payload.startId,
      };
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
