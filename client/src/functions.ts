import type { Coord, TileRecord } from "./types";
import { scrabbleWords } from "../euScrabbleWords";
export function isEqualCoord(c1: Coord, c2: Coord): boolean {
  return c1[0] === c2[0] && c1[1] === c2[1];
}

export function isCoord(token: unknown): token is Coord {
  return (
    Array.isArray(token) &&
    token.length === 2 &&
    token.every((val) => typeof val === "number")
  );
}

export type TileType =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
const tileTypes: TileType[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export function isTileType(value: unknown): value is TileType {
  return typeof value === "string" && tileTypes.includes(value as TileType);
}

export function canMove(start: Coord, destination: Coord, tiles: TileRecord[]) {
  // const rowDist = Math.abs(start[0] - destination[0]);
  // const colDist = Math.abs(start[1] - destination[1]);

  if (tiles.find((tile) => isEqualCoord(tile.location, destination))) {
    return false;
  }

  return true;
}

// do it like the app and like this website  //https://playscrabble.com/play/ai
export function isBoardValid(tiles: TileRecord[]) {
  // are all the fromRack tiles in the same row / column
  // are all the fromRack tiles next to one another - we dont actually need to check the whole board for this!
  // is at least one of the fromRack tiles adjacent to one of the existing board tiles
  // if any of the above are not met then dont display any validity state and just stop here
  //
  // at this point presumably some new words have been created - are they vaild words
  // ---- get all words on the board. filter to only words that contain fromRack tiles
  // ---- display a lil score bubble at the start of one of these words
  // ---- if all words valid, bubble is green, if not then red
}

export function getTilesInInvalidWords(words: TileRecord[][]) {
  const invalidWords = getInvalidWords(words);
  console.log("invalidWords", invalidWords);
  const invalidTiles = invalidWords.flat();
  console.log("invalidTiles", invalidTiles);
  return invalidTiles;
}

function getInvalidWords(words: TileRecord[][]) {
  return words.filter(
    (word) =>
      !isWordValid(
        word
          .map((tr) => tr.letter)
          .join("")
          .toLowerCase()
      )
  );
}

function isWordValid(word: string) {
  return scrabbleWords.includes(word);
}

export function getWords(tiles: TileRecord[]) {
  const rowWords = getRowWords(tiles);
  const columnWords = getColumnWords(tiles);
  const words = [...rowWords, ...columnWords].filter((w) => w.length > 1);
  return words;
}

function getRowWords(tiles: TileRecord[]) {
  let words = [];
  let prevTile = false;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const squareCoord: Coord = [row, col];
      const tile = tiles.find((tile) =>
        isEqualCoord(tile.location, squareCoord)
      );
      if (tile) {
        if (words.length === 0) {
          words.push([tile]);
        } else {
          if (prevTile) {
            //if tile is prior square, add letter to existing word
            words[words.length - 1].push(tile);
          } else {
            //if no tile in prior square, start new word
            words.push([tile]);
          }
        }
        prevTile = true;
      } else {
        prevTile = false;
      }
    }
  }
  return words;
}

function getColumnWords(tiles: TileRecord[]) {
  let words = [];
  let prevTile = false;
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 10; row++) {
      const squareCoord: Coord = [row, col];
      const tile = tiles.find((tile) =>
        isEqualCoord(tile.location, squareCoord)
      );
      if (tile) {
        if (words.length === 0) {
          words.push([tile]);
        } else {
          if (prevTile) {
            //if tile is prior square, add letter to existing word
            words[words.length - 1].push(tile);
          } else {
            //if no tile in prior square, start new word
            words.push([tile]);
          }
        }
        prevTile = true;
      } else {
        prevTile = false;
      }
    }
  }

  return words;
}

export function getTilesWithoutNeighbours(tiles: TileRecord[]) {
  const tilesOnTheBoard = tiles.filter((tile) => tile.location[0] < 10);

  let invalidTiles = [];

  // checking that all tiles have a neighbour
  for (let i = 0; i < tilesOnTheBoard.length; i++) {
    const currentTile = tilesOnTheBoard[i];
    const currTileLocation = currentTile.location;
    const currTileY = currTileLocation[0];
    const currTileX = currTileLocation[1];
    const restOfTiles = tilesOnTheBoard.filter(
      (tile) =>
        tile.location[0] !== currTileLocation[0] ||
        tile.location[1] !== currTileLocation[1]
    );

    const neighbourFound = restOfTiles.find(
      (tile) =>
        (tile.location[0] === currTileY &&
          Math.abs(tile.location[1] - currTileX) <= 1) ||
        (tile.location[1] === currTileX &&
          Math.abs(tile.location[0] - currTileY) <= 1)
    );
    if (!neighbourFound) invalidTiles.push(currentTile);
  }
  return invalidTiles;
}

// on first load, we fetch the placed tile coords, and the tiles in our rack
// we render these onto the board and rack
// - note these starting board tiles cannot be moved
// then the tiles in the rack can be dragged onto the board
// we pass newTiles and startingTiles into the isBoardValid function

// each tile needs to clearly be designated as 'from the rack' or 'new' so that it is treated differently from the tiles

// all newly placed leetters must be placed in the same row / column

//THIS alone DOESNT WORK BECAUSE WHAT ABOUT TWO NEIGHBOURS THAT ARE DISCONNECTED FROM THE PACK
// must be used in combination with - at least one of the fromRack tiles must be adjacent to one of the existing tiles
//and ALL fromRack tiles must be placed in teh same column

//  ACTUALLY MAYBE ITS OVERKILL TO HIHGLIGHT EVERY SINGLE INVALID TILE ON THE SCREEN?
// APP JUST NEEDS A BOOLEAN ISVALID?

// AND INSTEAD WE SHOW GREEN BORDER WHEN IT IS VALID!

// 1. Realised I didnt'e need to check the entire board state for validity, in some cases can just check the tiles brought on.
// 2. much more efficient to really think properly about all this stuff and plan it out in pseudocode first.
