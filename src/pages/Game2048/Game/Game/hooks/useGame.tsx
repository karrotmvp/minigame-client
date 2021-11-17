import { useCallback, useEffect, useRef, useState } from 'react';
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

export const useGame = () => {
  const isInitialRender = useRef(true);
  const nextId = useUniqueId();
  const tileCountPerRowOrColumn = 4;
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
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const { highestScore } = useMyGame2048Data();

  const [nextBoard, setNextBoard] = useState<number[]>();
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

  const findEmptyTiles = useCallback(() => {
    const tileMap = retrieveTileMap();

    const emptyTiles = tileMap.reduce((result, tileId, index) => {
      if (tileId === 0) {
        return [...result, indexTocoordinate(index) as [number, number]];
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
        return random < 0.5 ? 17 : 269;
      };
      createTile({ coordinate, value: randomValue() });
    }
  }, [findEmptyTiles, createTile]);

  const coordinateToIndex = (coordinate: [number, number]) => {
    return coordinate[1] * tileCountPerRowOrColumn + coordinate[0];
  };

  const indexTocoordinate = (index: number) => {
    const x = index % tileCountPerRowOrColumn;
    const y = Math.floor(index / tileCountPerRowOrColumn);
    return [x, y];
  };

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

            let score = currentTile.value * 2;

            // delays the merge by 250ms, so the sliding animation can be completed.
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
            coordinate: indexTocoordinate(
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
      setTimeout(() => {
        dispatch(moveEndAction());
      }, animationDuration);

      setNextBoard(retrieveTileMap());
    },
    [dispatch, retrieveTileMap, throttledMergeTile, tiles, updateTile]
  );

  const moveLeftFactory = (board: number[]) => {
    const retrieveTileIdsByRow = (rowIndex: number) => {
      // const tileMap = retrieveTileMap();
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

  const resetGame = useCallback(() => {
    isInitialRender.current = true;
    dispatch(resetGameAction());
    if (highestScore === 0) {
      createTile({ coordinate: [1, 1], value: 2 });
      createTile({ coordinate: [3, 1], value: 2 });
    } else {
      generateRandomTile();
      generateRandomTile();
    }
  }, [createTile, dispatch, generateRandomTile, highestScore]);

  const hasDiff = (
    board: number[] | undefined,
    updatedBoard: number[] | undefined
  ) => {
    if (JSON.stringify(board) === JSON.stringify(updatedBoard)) {
      return false;
    } else {
      return true;
    }
  };

  const checkGameOver = useCallback(() => {
    // const tileMap = retrieveTileMap();
    const emptyTiles = findEmptyTiles();
    // const currBoard = retrieveTileMap();
    // const x = moveLeftFactory(currBoard);
    // console.log(currBoard === x());

    const currentBoard = retrieveTileMap();
    console.log('current board', currentBoard);
    console.log('next board', nextBoard);
    // const x = moveLeftFactory(retrieveTileMap());
    // const y = x();
    if (emptyTiles.length <= 0) {
      if (hasDiff(currentBoard, nextBoard)) {
        console.log('continue game');
        return false;
      } else {
        console.log('gameover');
        setIsGameOver(true);
        return true;
      }
    }

    // if (emptyTiles.length <= 0) {
    //   const currentBoard = retrieveTileMap();
    //   console.log(currentBoard);
    //   if (hasDiff(currentBoard, (() => moveLeftFactory(currentBoard))()())) {
    //     console.log('x');
    //     return false;
    //   }
    //   return true;
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findEmptyTiles, retrieveTileMap]);
  useEffect(() => {
    // setPrevBoard(retrieveTileMap);
    if (isInitialRender.current) {
      resetGame();
      isInitialRender.current = false;
      return;
    }

    if (!inMotion && hasChanged) {
      generateRandomTile();
    }

    console.log('is game over?', checkGameOver());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanged, inMotion, resetGame]);

  const tileList = byIds.map((tileId) => tiles[tileId]);

  const moveLeft = moveLeftFactory(retrieveTileMap());
  const moveRight = moveRightFactory(retrieveTileMap());
  const moveUp = moveUpFactory(retrieveTileMap());
  const moveDown = moveDownFactory(retrieveTileMap());

  return {
    score,
    tileList,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    resetGame,
    isGameOver,
  };
};
