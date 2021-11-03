import { TileProps } from '../Tile';

type GameState = {
  tiles: {
    [id: number]: TileProps;
  };
  inMotion: boolean;
  hasChanged: boolean;
  byIds: number[];
};

export const gameInitialState: GameState = {
  tiles: {},
  byIds: [],
  hasChanged: false,
  inMotion: false,
};

type GameAction =
  | { type: 'create'; tile: TileProps }
  | { type: 'update'; tile: TileProps }
  | { type: 'merge'; source: TileProps; destination: TileProps }
  | { type: 'move_start' }
  | { type: 'move_end' };

export const gameReducer: React.Reducer<GameState, GameAction> = (
  state,
  action
) => {
  switch (action.type) {
    case 'create':
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.tile.id]: action.tile,
        },
        byIds: [...state.byIds, action.tile.id],
        hasChanged: false,
      };
    case 'update':
      return {
        ...state,
        tiles: {
          ...state.tiles,
          [action.tile.id]: action.tile,
        },
        hasChanged: true,
      };
    case 'merge':
      const {
        [action.source.id]: source,
        [action.destination.id]: destination,
        ...restTiles
      } = state.tiles;
      return {
        ...state,
        tiles: {
          ...restTiles,
          [action.destination.id]: {
            id: action.destination.id,
            value: action.source.value + action.destination.value,
            coordinate: action.destination.coordinate,
          },
        },
        byIds: state.byIds.filter((id) => id !== action.source.id),
        hasChanged: true,
      };
    case 'move_start':
      return {
        ...state,
        inMotion: true,
      };
    case 'move_end':
      return {
        ...state,
        inMotion: false,
      };
    default:
      return state;
  }
};
