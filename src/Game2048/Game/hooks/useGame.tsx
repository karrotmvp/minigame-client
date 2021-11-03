import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { gameInitialState, gameReducer } from '../reducers/gameReducer';
import { TileProps } from '../Tile';

let uniqueId = 1;
const getUniqueId = () => {
  const nextId = () => {
    return uniqueId++;
  };

  return nextId;
};
const coordinateToIndex = (coordinate: [number, number]) => {
  return coordinate[1] * 4 + coordinate[0];
};

const indexToCoordinate = (index: number) => {
  const x = index % 4;
  const y = Math.floor(index / 4);
  return [x, y];
};

export const useGame = () => {
  const initialRender = useRef(true);
  const [state, dispatch] = useReducer(gameReducer, gameInitialState);
  const uniqueId = getUniqueId();
  const tileArray: TileProps[] = state.byIds.map((id) => state.tiles[id]);

  //   const arr = [1,2,3,4,5,6,7,8,9];

  // const newArr = [];
  // while(arr.length) newArr.push(arr.splice(0,3));

  // console.log(newArr);
  const indexToCoordinate = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return [row, col];
  };

  // const isEmptyCell = (board: number[][]) => {
  //   for (let i = 0; i < board.length; i++) {
  //     for (let j = 0; j < board[i].length; j++) {
  //       if (board[i][j] === 0) return true;
  //     }
  //   }
  // };
  const createTile = useCallback(
    ({ coordinate, value }: Partial<TileProps>) => {
      const tile = {
        id: uniqueId(),
        coordinate,
        value,
      } as TileProps;
      dispatch({ type: 'create', tile });
    },
    [uniqueId]
  );
  const mergeTile = (source: TileProps, destination: TileProps) => {
    dispatch({ type: 'merge', source, destination });
  };

  const getBoard = useCallback(() => {
    const board: number[] = Array(16).fill(0);
    state.byIds.forEach((id) => {
      const { coordinate } = state.tiles[id];
      const index = coordinateToIndex(coordinate);
      board[index] = id;
    });
    // const board2D = [];
    // while (board.length > 0) {
    //   board2D.push(board.splice(0, 4));
    // }
    // console.log(board2D);
    console.log('previousBoard', board);

    return board;
  }, [state.byIds, state.tiles]);

  const findEmptyCells = useCallback(() => {
    const board = getBoard();
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        emptyCells.push(i);
      }
    }
    return emptyCells;
  }, [getBoard]);

  const generateRandomTile = useCallback(() => {
    // 10% chance of 4 tile is being generated
    const randomValue = () => {
      const random = Math.random();
      if (random < 0.1) {
        return 4;
      } else {
        return 2;
      }
    };
    const randomIndex = () => {
      return Math.floor(Math.random() * 16);
    };

    const emptyCells = findEmptyCells();
    if (emptyCells.length > 0) {
      const coordinate = indexToCoordinate(randomIndex()) as [number, number];
      const value = randomValue();
      createTile({ coordinate, value });
    }
  }, [createTile, findEmptyCells]);

  // const move = () => {
  //   // new tiles cannot be created during motion.
  //   // dispatch({ type: "START_MOVE" });

  //   const maxIndex = 3;

  //   // iterates through every row or column (depends on move kind - vertical or horizontal).
  //   for (
  //     let rowOrColumnIndex = 0;
  //     rowOrColumnIndex < 4;
  //     rowOrColumnIndex += 1
  //   ) {
  //     // retrieves tiles in the row or column.
  //     const availableTileIds = retrieveTileIdsPerRowOrColumn(rowOrColumnIndex);

  //     // previousTile is used to determine if tile can be merged with the current tile.
  //     let previousTile: TileProps | undefined;
  //     // mergeCount helps to fill gaps created by tile merges - two tiles become one.
  //     let mergedTilesCount = 0;

  //     // interate through available tiles.
  //     availableTileIds.forEach((tileId, nonEmptyTileIndex) => {
  //       const currentTile = tiles[tileId];

  //       // if previous tile has the same value as the current one they should be merged together.
  //       if (
  //         previousTile !== undefined &&
  //         previousTile.value === currentTile.value
  //       ) {
  //         const tile = {
  //           ...currentTile,
  //           position: previousTile.position,
  //           mergeWith: previousTile.id,
  //         } as TileMeta;

  //         // delays the merge by 250ms, so the sliding animation can be completed.
  //         throttledMergeTile(tile, previousTile);
  //         // previous tile must be cleared as a single tile can be merged only once per move.
  //         previousTile = undefined;
  //         // increment the merged counter to correct position for the consecutive tiles to get rid of gaps
  //         mergedTilesCount += 1;

  //         return updateTile(tile);
  //       }

  //       // else - previous and current tiles are different - move the tile to the first free space.
  //       const tile = {
  //         ...currentTile,
  //         position: indexToPosition(
  //           calculateFirstFreeIndex(
  //             rowOrColumnIndex,
  //             nonEmptyTileIndex,
  //             mergedTilesCount,
  //             maxIndex
  //           )
  //         ),
  //       } as TileMeta;

  //       // previous tile become the current tile to check if the next tile can be merged with this one.
  //       previousTile = tile;

  //       // only if tile has changed its position it will be updated
  //       if (didTileMove(currentTile, tile)) {
  //         return updateTile(tile);
  //       }
  //     });
  //   }

  //   // wait until the end of all animations.
  //   const animationDuration = 250;
  //   setTimeout(() => dispatch({ type: 'move_end' }), animationDuration);
  // };

  // const moveLeft = () => {
  //   const retrieveTileIdsByRow = (rowIndex: number) => {
  //     const tileMap = retrieveTileMap();

  //     const tileIdsInRow = [
  //       tileMap[rowIndex * tileCountPerRowOrColumn + 0],
  //       tileMap[rowIndex * tileCountPerRowOrColumn + 1],
  //       tileMap[rowIndex * tileCountPerRowOrColumn + 2],
  //       tileMap[rowIndex * tileCountPerRowOrColumn + 3],
  //     ];

  //     const nonEmptyTiles = tileIdsInRow.filter((id) => id !== 0);
  //     return nonEmptyTiles;
  //   };

  //   const calculateFirstFreeIndex = (
  //     tileIndex: number,
  //     tileInRowIndex: number,
  //     howManyMerges: number,
  //     _: number
  //   ) => {
  //     return (
  //       tileIndex * tileCountPerRowOrColumn + tileInRowIndex - howManyMerges
  //     );
  //   };

  //   return move.bind(this, retrieveTileIdsByRow, calculateFirstFreeIndex);
  // };

  const convertTo2D = (board: number[]) => {
    let board2D = [];
    while (board.length > 0) {
      board2D.push(board.splice(0, 4));
    }
    return board2D as number[][];
  };
  const moveRight = () => {
    const board = getBoard();
    const board2D = convertTo2D(board);
    let newBoard = [];
    for (let i = 0; i < board2D.length; i++) {
      let filteredRow = board2D[i].filter((row) => row);
      let emptyCells = Array(4 - filteredRow.length).fill(0);
      let newRow = emptyCells.concat(filteredRow);
      newBoard.push(newRow);
    }
    console.log('newboard', newBoard);
    return newBoard;
    // const nonEmptyCells = board2D.filter((id) => id !== 0);
    // console.log('nonEmptyCells', nonEmptyCells);

    // const nonEmptyCells = board2D.filter((id) => id !== 0);
  };

  // const moveLeft = () => {
  //   const board = getBoard();
  //   let board2D = [];
  //   while (board.length > 0) {
  //     board2D.push(board.splice(0, 4));
  //   }
  //   let newBoard = [];
  //   for (let i = 0; i < board2D.length; i++) {
  //     let filteredRow = board2D[i].filter((row) => row);
  //     let emptyCells = Array(4 - filteredRow.length).fill(0);
  //     let newRow = filteredRow.concat(emptyCells);
  //     newBoard.push(newRow);
  //   }
  //   // board = newBoard;
  //   console.log('new', newBoard);
  //   return newBoard;
  // };
  // console.log(state.tiles);

  // const moveRight = () => {
  //   const board2D = [];
  //   while (board.length > 0) {
  //     board2D.push(board.splice(0, 4));
  //   }
  //   console.log(board2D);
  //   let newBoard = [];
  //   for (let i = 0; i < board2D.length; i++) {
  //     let filteredRow = board2D[i].filter((row) => row);
  //     let emptyCells = Array(4 - filteredRow.length).fill(0);
  //     let newRow = emptyCells.concat(filteredRow);
  //     newBoard.push(newRow);
  //   }
  //   // board = newBoard;
  //   return newBoard;
  // };
  // const moveLeft = () => {
  //   const board2D = [];
  //   while (board.length > 0) {
  //     board2D.push(board.splice(0, 4));
  //   }
  //   console.log(board2D);
  //   let newBoard = [];
  //   for (let i = 0; i < board2D.length; i++) {
  //     let filteredRow = board2D[i].filter((row) => row);
  //     let emptyCells = Array(4 - filteredRow.length).fill(0);
  //     let newRow = filteredRow.concat(emptyCells);
  //     newBoard.push(newRow);
  //   }
  //   return newBoard;
  // };

  const merge = () => {};

  // array transpose
  // array[0].map((_, colIndex) => array.map(row => row[colIndex]));

  useEffect(() => {
    if (initialRender.current === true) {
      createTile({ coordinate: [0, 1], value: 2 });
      createTile({ coordinate: [0, 2], value: 2 });
      initialRender.current = false;
      return;
    }

    if (!state.inMotion && state.hasChanged) {
      generateRandomTile();
    }
  }, [createTile, generateRandomTile, state.inMotion, state.hasChanged]);

  return { tileArray, moveRight };
};
