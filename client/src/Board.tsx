import { useEffect, useState } from "react";
import "./Board.css"
import { canMove, isCoord, isEqualCoord, isTileType } from "./functions";
import { Square } from "./Square";
import { Tile } from "./Tile";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Coord, TileRecord } from "./types";
import { Rack } from "./Rack";

export const Board = ({initialTiles}: {initialTiles: TileRecord[]}) => {
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

                const tile = tiles.find((t) => isEqualCoord(t.location, sourceLocation));
                const restOfTiles = tiles.filter((t) => t !== tile);

                if (
                    canMove(sourceLocation, destinationLocation, tiles) &&
                    tile !== undefined
                ) {
                    // moving the tile!
                    setTiles([{ letter: tile.letter, value: tile.value, fromRack: tile.fromRack, location: destinationLocation }, ...restOfTiles]);
                }
            },
        });
    }, [tiles]);

    const squares = renderSquares(tiles)
    const rackSquares = renderRackSquares(tiles)

    // const isValid = isBoardValid(tiles)
    getRowWords(tiles)
    return (
        <>
        <div className="board">
            {squares}
        </div>
        <Rack>
            {rackSquares}
        </Rack>
        {/* <p>{isValid ? "valid" : "invalid"}</p> */}
        </>
    )
}

  function renderSquares(tiles: TileRecord[]) {
        const squares = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const squareCoord: Coord = [row, col];
    
                const tile = tiles.find((tile) => isEqualCoord(tile.location, squareCoord));
    
                squares.push(
                    <Square tiles={tiles} location={squareCoord} key={squareCoord.join()}>
                         {/* {tile && pieceLookup[piece.type]()} */}
                         {tile && <Tile tile={tile}/>}
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
                         {tile && <Tile tile={tile}/>}
                    </Square>
                );
            }
        return squares;
    }

    function getRowWords(tiles: TileRecord[]){
        console.log('allTiles', tiles)

        const row = 5
        let words = []
        let prevTile = false
        for (let col = 0; col < 10; col++) {
            const squareCoord: Coord = [row, col];
            const tile = tiles.find((tile) => isEqualCoord(tile.location, squareCoord));
            if(tile) {
                if(words.length === 0){
                    words.push([tile])
                } else {
                    if(prevTile) {
                        //if tile is prior square, add letter to existing word
                        words[words.length -1].push(tile)
                    } else {
                        //if no tile in prior square, start new word
                        words.push([tile])
                    }
                }
                prevTile = true;
            } else {
                prevTile = false
            }

        }
    console.log(' words', words)
    console.log(' wordsLetters', words.map(word => word.map(tile => tile.letter)))
    // trim commas from start and end
    // then do join on the commas
    // const words = rowTiles.join(",")

        return words
    }

    function isBoardValid(tiles: TileRecord[]){
        // console.log('allTiles', tiles)
        const tilesOnTheBoard = tiles.filter(tile => tile.location[0] < 10)
        // does each distinct column and row form a valid word
            // find the rows of words
                //check validity of each
            // find the columns of words

        let invalidTiles = []
            
        // checking that all tiles have a neighbour
        for(let i = 0; i<tilesOnTheBoard.length; i++){
            const currentTile = tilesOnTheBoard[i]
            // console.log('currentTile', currentTile)
            //now search through all other tiles, are any of them adjacent. if we have y=5, x=7
                //i.e. we need y=5 (same as currTile) and x=6 or 8 i.e. currTile x+1 or x-1
                //OR   we need y = currTile +-1  and x=same as currTile
                const currTileLocation = currentTile.location
                const currTileY = currTileLocation[0]
                const currTileX = currTileLocation[1]
            // console.log('currTileY', currTileY)
            // console.log('currTileX', currTileX)
            const restOfTiles = tilesOnTheBoard.filter(tile => tile.location[0] !== currTileLocation[0] || tile.location[1] !== currTileLocation[1])
            // console.log('restOfTiles', restOfTiles)

            const neighbourFound = restOfTiles.find(tile => (tile.location[0] === currTileY && Math.abs(tile.location[1] - currTileX) <=1)
             || (tile.location[1] === currTileX && Math.abs(tile.location[0] - currTileY) <=1))
            // console.log('neighbourFound', neighbourFound)
            if(!neighbourFound) invalidTiles.push(currentTile)
        }
    // console.log('invalidTiles',invalidTiles)
        return invalidTiles.length === 0
    }

    // on first load, we fetch the placed tile coords, and the tiles in our rack
        // we render these onto the board and rack
    // - note these starting board tiles cannot be moved
    // then the tiles in the rack can be dragged onto the board
    // we pass newTiles and startingTiles into the isBoardValid function 

    // each tile needs to clearly be designated as 'from the rack' or 'new' so that it is treated differently from the tiles