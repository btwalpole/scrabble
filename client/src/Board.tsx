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

    const isValid = isBoardValid(tiles)
    return (
        <>
        {!isValid && <p>Invalid</p>}
        <div className="board">
            {squares}
        </div>
        <Rack>
            {rackSquares}
        </Rack>
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

    function isBoardValid(tiles: TileRecord[]){
        console.log(tiles)
        // does each distinct column and row form a valid word
            // find the rows of words
                //check validity of each
            // find the columns of words

        // at least one of the newly placed tiles must be adjacent to the initial tiles
        // so we need some separation between the tiles on the board at the start of the turn,
            // and the tiles you are placing from your rack!!
        return false
    }

    // on first load, we fetch the placed tile coords, and the tiles in our rack
        // we render these onto the board and rack
    // - note these starting board tiles cannot be moved
    // then the tiles in the rack can be dragged onto the board
    // we pass newTiles and startingTiles into the isBoardValid function 

    // each tile needs to clearly be designated as 'from the rack' or 'new' so that it is treated differently from the tiles