import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import {
  createTileAction,
  mergeTileAction,
  moveEndAction,
  moveStartAction,
  resetGameAction,
  updateScoreAction,
  updateTileAction,
} from 'pages/Game2048/Game/Game/reducers/game2048Reducer';
import { TileProps } from '../Tile';
import { useUniqueId } from './useUniqueId';
import { animationDuration } from '../styles';
import { useMyGame2048Data } from 'pages/Game2048/hooks';

type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];
type CalculateTileIndex = (
  tileIndex: number,
  tileInRowIndex: number,
  howManyMerges: number,
  maxIndexInRow: number
) => number;

const coordinateToIndex = (coordinate: [number, number]) => {
  return coordinate[1] * 4 + coordinate[0];
};
const indexToCoordinate = (index: number) => {
  const x = index % 4;
  const y = Math.floor(index / 4);
  return [x, y];
};

export const useGame = () => {
  // const isInitialRender = useRef(true);
  const { score: bestScore } = useMyGame2048Data();
  const nextId = useUniqueId();
  const dispatch = useDispatch();
  const { score, tiles, byIds, hasChanged, inMotion } = useSelector(
    (state: RootState) => ({
      tiles: state.game2048Reducer.tiles,
      byIds: state.game2048Reducer.byIds,
      hasChanged: state.game2048Reducer.hasChanged,
      inMotion: state.game2048Reducer.inMotion,
      score: state.game2048Reducer.score,
    })
  );
  // Tile manager
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
  const mergeTile = (source: TileProps, destination: TileProps) => {
    dispatch(mergeTileAction(source, destination));
  };
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
    console.log(tileMap);
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

  const generateRandomTile = () => {
    const emptyTiles = findEmptyTiles();
    console.log('empty tiles:', emptyTiles);
    if (emptyTiles.length > 0) {
      const randomCoordinate = () => {
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        return emptyTiles[randomIndex];
      };
      const randomValue = () => {
        const random = Math.random();
        return random < 0.9 ? 2 : 4;
      };
      console.log(randomCoordinate());
      createTile({ coordinate: randomCoordinate(), value: randomValue() });
    }
  };

  // Move controller
  const move = (
    retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
    calculateFirstFreeIndex: CalculateTileIndex
  ) => {
    dispatch(moveStartAction());
    const maxIndex = 4 - 1;
    for (
      let rowOrColumnIndex = 0;
      rowOrColumnIndex < 4;
      rowOrColumnIndex += 1
    ) {
      const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);
      let previousTile: TileProps | undefined;
      let mergedTilesCount = 0;

      availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
        const currentTile = tiles[tileId];
        if (
          previousTile !== undefined &&
          previousTile.value === currentTile.value
        ) {
          const tile = {
            ...currentTile,
            coordinate: previousTile.coordinate,
            mergeWith: previousTile.id,
          } as TileProps;

          let score = currentTile.value * 2;
          throttledMergeTile(tile, previousTile);
          dispatch(updateScoreAction(score));
          previousTile = undefined;
          mergedTilesCount += 1;

          return updateTile(tile);
        }
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

        previousTile = tile;

        if (didTileMove(currentTile, tile)) {
          return updateTile(tile);
        }
      });
    }

    setTimeout(() => dispatch(moveEndAction()), animationDuration);
  };
  const moveLeft = () => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = retrieveTileMap();

      const tileIdsInRow = [
        tileMap[rowIndex * 4 + 0],
        tileMap[rowIndex * 4 + 1],
        tileMap[rowIndex * 4 + 2],
        tileMap[rowIndex * 4 + 3],
      ];
      console.log('moveLeft, tileIdsInRow', tileIdsInRow);
      const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
      console.log('moveLeft', nonEmptyTiles);
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

    dispatch(moveStartAction());
    const maxIndex = 4 - 1;
    for (
      let rowOrColumnIndex = 0;
      rowOrColumnIndex < 4;
      rowOrColumnIndex += 1
    ) {
      const availableTileIds = retrieveTileIdsByRow(rowOrColumnIndex);
      let previousTile: TileProps | undefined;
      let mergedTilesCount = 0;

      availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
        const currentTile = tiles[tileId];
        if (
          previousTile !== undefined &&
          previousTile.value === currentTile.value
        ) {
          const tile = {
            ...currentTile,
            coordinate: previousTile.coordinate,
            mergeWith: previousTile.id,
          } as TileProps;

          let score = currentTile.value * 2;
          throttledMergeTile(tile, previousTile);
          dispatch(updateScoreAction(score));
          previousTile = undefined;
          mergedTilesCount += 1;

          return updateTile(tile);
        }
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

        previousTile = tile;

        if (didTileMove(currentTile, tile)) {
          return updateTile(tile);
        }
      });
    }

    setTimeout(() => dispatch(moveEndAction()), animationDuration);

    // return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };
  const moveRight = () => {
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
  const moveUp = () => {
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
  const moveDown = () => {
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

  // Game controller
  const resetGame = () => {
    dispatch(resetGameAction());

    if (bestScore === 0) {
      createTile({ coordinate: [3, 1], value: 2 });
      createTile({ coordinate: [1, 1], value: 2 });
    } else {
      generateRandomTile();
      generateRandomTile();
    }
    console.log('reset');
  };
  const checkGameOver = () => {
    const emptyTiles = findEmptyTiles();
    console.log('check game over', emptyTiles);

    if (emptyTiles.length <= 0) {
      console.log('gameover');
    }
  };

  useEffect(() => {
    checkGameOver();
    console.log(inMotion, hasChanged);
    if (!inMotion || hasChanged) {
      console.log('generate tile');
      generateRandomTile();
    }
  }, [inMotion, hasChanged]);
  // useEffect(() => {
  //   if (isInitialRender.current) {
  //     if (bestScore === 0) {
  //       createTile({ coordinate: [3, 1], value: 2 });
  //       createTile({ coordinate: [1, 1], value: 2 });
  //     } else {
  //       resetGame();
  //     }
  //     isInitialRender.current = false;
  //   }
  // }, [bestScore]);

  // useEffect(() => {
  //   if (!inMotion && hasChanged) {
  //     console.log('generate tile');
  //     generateRandomTile();
  //   }
  // }, [inMotion, hasChanged]);
  const tileList = byIds.map((tileId) => tiles[tileId]);

  return {
    score,
    tileList,

    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    resetGame,
    checkGameOver,
  };
};
