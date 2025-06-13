import { useEffect, useState } from "react";
import "./Board.css";
import {
  canMove,
  isCoord,
  isEqualCoord,
  isTileType,
  getWords,
  getTilesWithoutNeighbours,
  getTilesInInvalidWords,
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

  const tilesWithoutNeighbours = getTilesWithoutNeighbours(tiles);
  const allWords = getWords(tiles);

  // const isValid = isBoardValid(tiles)
  // getRowWords(tiles)
  // getColumnWords(tiles)
  console.log("allWords", allWords);

  //   const invalidWords = getInvalidWords(allWords);
  const tilesInInvalidWords = getTilesInInvalidWords(allWords);

  console.log("tilesInInvalidWords", tilesInInvalidWords);
  console.log("tilesWithoutNeighbours", tilesWithoutNeighbours);

  const invalidTiles = [...tilesInInvalidWords, ...tilesWithoutNeighbours];

  const squares = renderSquares(tiles, invalidTiles);
  const rackSquares = renderRackSquares(tiles);

  return (
    <>
      <div className="board">{squares}</div>
      <Rack>{rackSquares}</Rack>
      {/* <p>{isValid ? "valid" : "invalid"}</p> */}
    </>
  );
};

function renderSquares(tiles: TileRecord[], invalidTiles: TileRecord[]) {
  const squares = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const squareCoord: Coord = [row, col];

      const tile = tiles.find((tile) =>
        isEqualCoord(tile.location, squareCoord)
      );

      const tileHasNoNeighbours =
        tile &&
        Boolean(
          invalidTiles.find((t) => isEqualCoord(t.location, tile?.location))
        );

      squares.push(
        <Square tiles={tiles} location={squareCoord} key={squareCoord.join()}>
          {/* {tile && pieceLookup[piece.type]()} */}
          {tile && <Tile tile={tile} invalid={tileHasNoNeighbours} />}
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
    const squareCoord: Coord = [row, col];

    const tile = tiles.find((tile) => isEqualCoord(tile.location, squareCoord));

    squares.push(
      <Square tiles={tiles} location={squareCoord} key={squareCoord.join()}>
        {/* {tile && pieceLookup[piece.type]()} */}
        {tile && <Tile tile={tile} />}
      </Square>
    );
  }
  return squares;
}
