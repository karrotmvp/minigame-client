import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  game2048Reducer,
  initialState,
  createTileAction,
  mergeTileAction,
  moveEndAction,
  moveStartAction,
  resetGameAction,
  updateScoreAction,
  updateTileAction,
  setGameDataAction,
} from '../reducers';
import type { TileProps } from '../Game/Tile';
// import { useUniqueId } from './useUniqueId';
import { animationDuration } from '../Game/styles';
// import { useMyGame2048Data } from 'pages/Game2048/hooks';

const tileCountPerRowOrColumn = 4;

const coordinateToIndex = (coordinate: [number, number]) => {
  return coordinate[1] * tileCountPerRowOrColumn + coordinate[0];
};

export const indexTocoordinate = ({
  index,
  tileCountPerRowOrColumn,
}: {
  index: number;
  tileCountPerRowOrColumn: number;
}) => {
  const x = index % tileCountPerRowOrColumn;
  const y = Math.floor(index / tileCountPerRowOrColumn);
  return [x, y];
};

export const useGame = () => {
  // const nextId = useUniqueId();
  // const { highestScore } = useMyGame2048Data();
  const [state, dispatch] = useReducer(game2048Reducer, initialState);
  const { score, tiles, byIds, hasChanged, inMotion, startId } = state;
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  let uniqueId = startId + 1;
  const nextId = useCallback(() => {
    return uniqueId++;
  }, [uniqueId]);

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

  const mergeTile = useCallback(
    (source: TileProps, destination: TileProps) => {
      dispatch(mergeTileAction(source, destination));
    },
    [dispatch]
  );

  const throttledMergeTile = useCallback(
    (source: TileProps, destination: TileProps) => {
      setTimeout(() => mergeTile(source, destination), animationDuration);
    },
    [mergeTile]
  );

  const updateTile = useCallback(
    (tile: TileProps) => {
      dispatch(updateTileAction(tile));
    },
    [dispatch]
  );

  const didTileMove = (source: TileProps, destination: TileProps) => {
    const hasXChanged = source.coordinate[0] !== destination.coordinate[0];
    const hasYChanged = source.coordinate[1] !== destination.coordinate[1];

    return hasXChanged || hasYChanged;
  };

  const retrieveTileMap = useCallback(() => {
    const tileMap = new Array(
      tileCountPerRowOrColumn * tileCountPerRowOrColumn
    ).fill(0) as number[];

    byIds.forEach((id) => {
      const { coordinate } = tiles[id];
      const index = coordinateToIndex(coordinate);
      tileMap[index] = id;
    });

    return tileMap;
  }, [byIds, tiles]);

  const retrieveTileMapByValue = useCallback(() => {
    const tileMap = new Array(
      tileCountPerRowOrColumn * tileCountPerRowOrColumn
    ).fill(0) as number[];

    byIds.forEach((id) => {
      const { coordinate } = tiles[id];
      const index = coordinateToIndex(coordinate);
      tileMap[index] = tiles[id].value;
    });

    return tileMap;
  }, [byIds, tiles]);

  const findEmptyTiles = useCallback(() => {
    const tileMap = retrieveTileMap();

    const emptyTiles = tileMap.reduce((result, tileId, index) => {
      if (tileId === 0) {
        return [
          ...result,
          indexTocoordinate({ index: index, tileCountPerRowOrColumn: 4 }) as [
            number,
            number
          ],
        ];
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
      const randomValue = () => {
        const random = Math.random();
        return random < 0.9 ? 2 : 4;
      };
      createTile({ coordinate, value: randomValue() });
    }
  }, [findEmptyTiles, createTile]);

  type RetrieveTileIdsPerRowOrColumn = (rowOrColumnIndex: number) => number[];

  type CalculateTileIndex = (
    tileIndex: number,
    tileInRowIndex: number,
    howManyMerges: number,
    maxIndexInRow: number
  ) => number;

  const move = useCallback(
    (
      retrieveTileIdsPerRowOrColumn: RetrieveTileIdsPerRowOrColumn,
      calculateFirstFreeIndex: CalculateTileIndex
    ) => {
      // new tiles cannot be created during motion.
      dispatch(moveStartAction());
      const maxIndex = tileCountPerRowOrColumn - 1;

      let combinedScore = 0;

      // iterates through every row or column (depends on move kind - vertical or horizontal).
      for (
        let rowOrColumnIndex = 0;
        rowOrColumnIndex < tileCountPerRowOrColumn;
        rowOrColumnIndex += 1
      ) {
        // retrieves tiles in the row or column.
        const availableTileIds =
          retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);

        // previousTile is used to determine if tile can be merged with the current tile.
        let previousTile: TileProps | undefined;
        // mergeCount helps to fill gaps created by tile merges - two tiles become one.
        let mergedTilesCount = 0;

        let scorekeeper = 0;
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

            scorekeeper += currentTile.value * 2;
            // delays the merge by 100ms, so the sliding animation can be completed.
            throttledMergeTile(tile, previousTile);

            // previous tile must be cleared as a single tile can be merged only once per move.
            previousTile = undefined;
            // increment the merged counter to correct coordinate for the consecutive tiles to get rid of gaps
            mergedTilesCount += 1;

            return updateTile(tile);
          }

          // else - previous and current tiles are different - move the tile to the first free space.
          const tile = {
            ...currentTile,
            coordinate: indexTocoordinate({
              index: calculateFirstFreeIndex(
                rowOrColumnIndex,
                nonEmptyTileIndex,
                mergedTilesCount,
                maxIndex
              ),
              tileCountPerRowOrColumn: 4,
            }),
          } as TileProps;

          // previous tile become the current tile to check if the next tile can be merged with this one.
          previousTile = tile;

          // only if tile has changed its coordinate it will be updated
          if (didTileMove(currentTile, tile)) {
            return updateTile(tile);
          }
        });

        combinedScore += scorekeeper;
      }
      dispatch(updateScoreAction(combinedScore));
      // wait until the end of all animations.
      setTimeout(() => {
        dispatch(moveEndAction());
      }, animationDuration);
    },
    [dispatch, throttledMergeTile, tiles, updateTile]
  );

  // move-factory
  const moveLeftFactory = (board: number[]) => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = board;
      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
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
      return (
        tileIndex * tileCountPerRowOrColumn + tileInRowIndex - howManyMerges
      );
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };
  const moveRightFactory = (board: number[]) => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      const tileMap = board;

      const tileIdsInRow = [
        tileMap[rowIndex * tileCountPerRowOrColumn + 0],
        tileMap[rowIndex * tileCountPerRowOrColumn + 1],
        tileMap[rowIndex * tileCountPerRowOrColumn + 2],
        tileMap[rowIndex * tileCountPerRowOrColumn + 3],
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
      return (
        tileIndex * tileCountPerRowOrColumn +
        maxIndexInRow +
        howManyMerges -
        tileInRowIndex
      );
    };

    return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  };
  const moveUpFactory = (board: number[]) => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = board;

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
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
      return (
        tileIndex +
        tileCountPerRowOrColumn * (tileInColumnIndex - howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };
  const moveDownFactory = (board: number[]) => {
    const retrieveTileIdsByColumn = (columnIndex: number) => {
      const tileMap = board;

      const tileIdsInColumn = [
        tileMap[columnIndex + tileCountPerRowOrColumn * 0],
        tileMap[columnIndex + tileCountPerRowOrColumn * 1],
        tileMap[columnIndex + tileCountPerRowOrColumn * 2],
        tileMap[columnIndex + tileCountPerRowOrColumn * 3],
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
        tileIndex +
        tileCountPerRowOrColumn *
          (maxIndexInColumn - tileInColumnIndex + howManyMerges)
      );
    };

    return move.bind(this, retrieveTileIdsByColumn, calculateFirstFreeIndex);
  };

  // reset-game
  const resetGame = useCallback(async () => {
    setIsGameOver(false);

    dispatch(resetGameAction());

    generateRandomTile();
    generateRandomTile();
  }, [generateRandomTile]);

  // game-over
  function transpose(matrix: number[][]) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }
  const checkGameOver = () => {
    const tileMap = retrieveTileMapByValue();
    const matrix = [];
    while (tileMap.length) matrix.push(tileMap.splice(0, 4));
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === matrix[i][j + 1]) {
          return false;
        }
      }
    }
    const transposedMatrix = transpose(matrix);
    for (let i = 0; i < transposedMatrix.length; i++) {
      for (let j = 0; j < transposedMatrix[i].length; j++) {
        if (transposedMatrix[i][j] === transposedMatrix[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  };
  useEffect(() => {
    if (!inMotion && hasChanged) {
      generateRandomTile();
    }
    if (findEmptyTiles().length === 0) {
      setIsGameOver(checkGameOver());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanged, inMotion]);

  const tileList = byIds.map((tileId) => tiles[tileId]);
  const moveLeft = moveLeftFactory(retrieveTileMap());
  const moveRight = moveRightFactory(retrieveTileMap());
  const moveUp = moveUpFactory(retrieveTileMap());
  const moveDown = moveDownFactory(retrieveTileMap());

  const boardByValue = retrieveTileMapByValue();
  const setGameData = useCallback(
    (
      tiles: {
        [id: number]: TileProps;
      },
      byIds: number[],
      score: number,
      startId: number
    ) => dispatch(setGameDataAction(tiles, byIds, score, startId)),
    []
  );
  return {
    score,
    tileList,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    resetGame,
    isGameOver,
    boardByValue,
    setGameData,
  };
};
