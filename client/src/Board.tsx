import { useEffect, useState } from "react";
import "./Board.css";
import {
  canMove,
  isCoord,
  isEqualCoord,
  isTileType,
  getNewWords,
  areFromRackTilesPositionsValid,
  areNewWordsValid,
} from "./functions";
import { Square } from "./Square";
import { Tile } from "./Tile";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import type { Coord, TileRecord } from "./types";
import { Rack } from "./Rack";

export const Board = ({ initialTiles }: { initialTiles: TileRecord[] }) => {
  const [tiles, setTiles] = useState<TileRecord[]>(initialTiles);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }
        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        const letter = source.data.letter;

        if (
          // type guarding
          !isCoord(destinationLocation) ||
          !isCoord(sourceLocation) ||
          !isTileType(letter)
        ) {
          return;
        }

        const tile = tiles.find((t) =>
          isEqualCoord(t.location, sourceLocation)
        );
        const restOfTiles = tiles.filter((t) => t !== tile);

        if (
          canMove(sourceLocation, destinationLocation, tiles) &&
          tile !== undefined
        ) {
          // moving the tile!
          setTiles([
            {
              letter: tile.letter,
              value: tile.value,
              fromRack: tile.fromRack,
              location: destinationLocation,
            },
            ...restOfTiles,
          ]);
        }
      },
    });
  }, [tiles]);

  const tilesOnTheBoard = tiles.filter((tile) => tile.location.y < 10);
  const rackTiles = tiles.filter((tile) => tile.location.y === 10);
  const fromRackTiles = tilesOnTheBoard.filter((t) => t.fromRack);
  console.log("tilesOnTheBoard", tilesOnTheBoard);
  console.log("rackTiles", rackTiles);

  // ideally we wouldn't be running any of this logic if fromRackTiles is empty.....
  // put this all in a hook?
  const rackTilePositionsValid =
    fromRackTiles.length > 0
      ? areFromRackTilesPositionsValid(fromRackTiles)
      : true;
  const newWords = rackTilePositionsValid ? getNewWords(tilesOnTheBoard) : []; //
  const newWordsValid = newWords?.length > 0 && areNewWordsValid(newWords);
  const pointsBubbleCoord = undefined;
  const newWordsPoints = 10;

  //we only want to bother checking the words if rackTilePositionsValid === true
  // but both the submit btn and renderSquares need to know about of the words

  const squares = renderSquares(
    tilesOnTheBoard,
    newWords,
    newWordsValid,
    newWordsPoints,
    pointsBubbleCoord
  );
  const rackSquares = renderRackSquares(rackTiles);

  return (
    <>
      <div className="board">{squares}</div>
      <Rack>{rackSquares}</Rack>
      <p>{newWordsValid ? "valid" : "invalid"}</p>
      {/** <btn disabled={!isBoardValid}>Submit</btn> */}
    </>
  );
};

function renderSquares(
  tiles: TileRecord[],
  newWords: TileRecord[][],
  newWordsValid: boolean,
  newWordsPoints: number,
  pointsBubbleCoord?: Coord
) {
  const squares = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const squareCoord: Coord = { x: col, y: row }; //[row, col];

      const tile = tiles.find((tile) =>
        isEqualCoord(tile.location, squareCoord)
      );

      const tileIsInValidWord =
        tile && newWordsValid
          ? Boolean(newWords.flat().find((t) => t.location === tile?.location))
          : false;

      // const showPointsBubble = isEqualCoord(tile.location, pointsBubbleCoord)

      // at this point presumably some new words have been created - are they vaild words
      // ---- get all words on the board. filter to only words that contain fromRack tiles
      // ---- display a lil score bubble at the start of one of these words
      // ---- if all words valid, bubble is green, if not then red

      squares.push(
        <Square
          tiles={tiles}
          location={squareCoord}
          key={`${squareCoord.x}-${squareCoord.y}`}
        >
          {/* {showPointsBubble && <PointsBubble value={newWordsPoints} valid={wordsValid} />} */}
          {tile && <Tile tile={tile} inNewWord={tileIsInValidWord} />}
          {/** Tile needs to optionally show a border if tile is part of valid new word */}
        </Square>
      );
    }
  }
  return squares;
}

function renderRackSquares(tiles: TileRecord[]) {
  const squares = [];
  const row = 10;
  for (let col = 0; col < 7; col++) {
    const squareCoord: Coord = { x: col, y: row }; //[row, col];

    const tile = tiles.find((tile) => isEqualCoord(tile.location, squareCoord));

    squares.push(
      <Square
        tiles={tiles}
        location={squareCoord}
        key={`${squareCoord.x}-${squareCoord.y}`}
      >
        {/* {tile && pieceLookup[piece.type]()} */}
        {tile && <Tile tile={tile} />}
      </Square>
    );
  }
  return squares;
}
