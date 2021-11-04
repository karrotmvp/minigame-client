import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  createTileAction,
  mergeTileAction,
  moveEndAction,
  moveStartAction,
  updateScoreAction,
  updateTileAction,
} from 'reducers/game2048Reducer';
import { animationDuration } from '../styles';
import { TileProps } from '../Tile';
import { useUniqueId } from './useUniqueId';

export const useGame = () => {
  const isInitialRender = useRef(true);
  const nextId = useUniqueId();

  const { tiles, byIds, hasChanged, inMotion } = useSelector(
    (state: RootState) => ({
      tiles: state.game2048Reducer.tiles,
      byIds: state.game2048Reducer.byIds,
      hasChanged: state.game2048Reducer.hasChanged,
      inMotion: state.game2048Reducer.inMotion,
    })
  );
  const dispatch = useDispatch();
  const createTile = useCallback(
    ({ coordinate, value }: Partial<TileProps>) => {
      const tile = {
        id: nextId(),
        coordinate,
        value,
      } as TileProps;
      dispatch(createTileAction(tile));
    },
    [dispatch, nextId]
  );
  // A must-have to keep the sliding animation if the action merges tiles together.
  const mergeTile = (source: TileProps, destination: TileProps) => {
    dispatch(mergeTileAction(source, destination));
  };

  // A must-have to keep the sliding animation if the action merges tiles together.
  const throttledMergeTile = (source: TileProps, destination: TileProps) => {
    setTimeout(() => mergeTile(source, destination), animationDuration);
  };

  const updateTile = (tile: TileProps) => {
    dispatch(updateTileAction(tile));
  };

  const didTileMove = (source: TileProps, destination: TileProps) => {
    const hasXChanged = source.coordinate[0] !== destination.coordinate[0];
    const hasYChanged = source.coordinate[1] !== destination.coordinate[1];

    return hasXChanged || hasYChanged;
  };

  const retrieveTileMap = useCallback(() => {
    const tileMap = new Array(16).fill(0);

    byIds.forEach((id) => {
      const { coordinate } = tiles[id];
      const index = coordinateToIndex(coordinate);
      tileMap[index] = id;
    });

    return tileMap;
  }, [byIds, tiles]);

  const findEmptyTiles = useCallback(() => {
    const tileMap = retrieveTileMap();

    const emptyTiles = tileMap.reduce((result, tileId, index) => {
      if (tileId === 0) {
        return [...result, indexToCoordinate(index) as [number, number]];
      }

      return result;
    }, [] as [number, number][]);

    return emptyTiles;
  }, [retrieveTileMap]);

  const generateRandomTile = useCallback(() => {
    const emptyTiles = findEmptyTiles();

    if (emptyTiles.length > 0) {
      const index = Math.floor(Math.random() * emptyTiles.length);
      const coordinate = emptyTiles[index];

      createTile({ coordinate, value: 2 });
    }
  }, [findEmptyTiles, createTile]);

  const coordinateToIndex = (coordinate: [number, number]) => {
    return coordinate[1] * 4 + coordinate[0];
  };

  const indexToCoordinate = (index: number) => {
    const x = index % 4;
    const y = Math.floor(index / 4);
    return [x, y];
  };

  type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

  type CalculateTileIndex = (
    tileIndex: number,
    tileInRowIndex: number,
    howManyMerges: number,
    maxIndexInRow: number
  ) => number;

  const move = (
    retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
    calculateFirstFreeIndex: CalculateTileIndex
  ) => {
    // new tiles cannot be created during motion.
    dispatch(moveStartAction());
    const maxIndex = 4 - 1;
    // iterates through every row or column (depends on move kind - vertical or horizontal).
    for (
      let rowOrColumnIndex = 0;
      rowOrColumnIndex < 4;
      rowOrColumnIndex += 1
    ) {
      // retrieves tiles in the row or column.
      const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);

      // previousTile is used to determine if tile can be merged with the current tile.
      let previousTile: TileProps | undefined;
      // mergeCount helps to fill gaps created by tile merges - two tiles become one.
      let mergedTilesCount = 0;
      // interate through available tiles.
      availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
        const currentTile = tiles[tileId];

        // if previous tile has the same value as the current one they should be merged together.
        if (
          previousTile !== undefined &&
          previousTile.value === currentTile.value
        ) {
          const tile = {
            ...currentTile,
            coordinate: previousTile.coordinate,
            mergeWith: previousTile.id,
          } as TileProps;

          // delays the merge by 250ms, so the sliding animation can be completed.
          let score = currentTile.value * 2;
          throttledMergeTile(tile, previousTile);
          dispatch(updateScoreAction(score));
          // previous tile must be cleared as a single tile can be merged only once per move.
          previousTile = undefined;
          // increment the merged counter to correct coordinate for the consecutive tiles to get rid of gaps
          mergedTilesCount += 1;

          return updateTile(tile);
        }

        // else - previous and current tiles are different - move the tile to the first free space.
        const tile = {
          ...currentTile,
          coordinate: indexToCoordinate(
            calculateFirstFreeIndex(
              rowOrColumnIndex,
              nonEmptyTileIndex,
              mergedTilesCount,
              maxIndex
            )
          ),
        } as TileProps;

        // previous tile become the current tile to check if the next tile can be merged with this one.
        previousTile = tile;

        // only if tile has changed its coordinate it will be updated
        if (didTileMove(currentTile, tile)) {
          return updateTile(tile);
        }
      });
    }
    // wait until the end of all animations.
    setTimeout(() => dispatch(moveEndAction()), animationDuration);
    // dispatch({ type: 'update_score', score: 0 });
  };

  const moveLeftFactory = () => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * 4 + 0],
        tileMap[rowIndex * 4 + 1],
        tileMap[rowIndex * 4 + 2],
        tileMap[rowIndex * 4 + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      return nonEmptyTiles;
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      _: number
    ) => {
      return tileIndex * 4 + tileInRowIndex - howManyMerges;
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };
  const moveRightFactory = () => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * 4 + 0],
        tileMap[rowIndex * 4 + 1],
        tileMap[rowIndex * 4 + 2],
        tileMap[rowIndex * 4 + 3],
      ];

      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInRowIndex: number,
      howManyMerges: number,
      maxIndexInRow: number
    ) => {
      return tileIndex * 4 + maxIndexInRow + howManyMerges - tileInRowIndex;
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };
  const moveUpFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + 4 * 0],
        tileMap[columnIndex + 4 * 1],
        tileMap[columnIndex + 4 * 2],
        tileMap[columnIndex + 4 * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles;
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      _: number
    ) => {
      return tileIndex + 4 * (tileInColumnIndex - howManyMerges);
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };
  const moveDownFactory = () => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInColumn = [
        tileMap[columnIndex + 4 * 0],
        tileMap[columnIndex + 4 * 1],
        tileMap[columnIndex + 4 * 2],
        tileMap[columnIndex + 4 * 3],
      ];

      const nonEmptyTiles = tileIdsInColumn.filter((id) => id !== 0);
      return nonEmptyTiles.reverse();
    };

    const calculateFirstFreeIndex = (
      tileIndex: number,
      tileInColumnIndex: number,
      howManyMerges: number,
      maxIndexInColumn: number
    ) => {
      return (
        tileIndex + 4 * (maxIndexInColumn - tileInColumnIndex + howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      createTile({ coordinate: [0, 1], value: 2 });
      createTile({ coordinate: [0, 2], value: 2 });
      isInitialRender.current = false;
      return;
    }
    if (!inMotion && hasChanged) {
      generateRandomTile();
    }
  }, [hasChanged, inMotion, createTile, generateRandomTile]);

  const tileList = byIds.map((tileId) => tiles[tileId]);
  // const turnScore = score;
  // console.log('turnScore', score);
  const moveLeft = moveLeftFactory();
  const moveRight = moveRightFactory();
  const moveUp = moveUpFactory();
  const moveDown = moveDownFactory();

  return { tileList, moveLeft, moveRight, moveUp, moveDown };
};
