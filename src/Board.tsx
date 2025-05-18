import { useEffect, useState } from "react";
import "./Board.css"
import { canMove, isCoord, isEqualCoord, isTileType } from "./functions";
import { Square } from "./Square";
import { Tile } from "./Tile";
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type { Coord, TileRecord } from "./types";
import { Rack } from "./Rack";

export const Board = () => {
           const [tiles, setTiles] = useState<TileRecord[]>([
    { letter: 'A', value: 1, location: [3, 2] },
            { letter: 'P',value: 3,  location: [1, 6] },
            { letter: 'X',value: 10,  location: [10, 6] },
    ]);

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
                    setTiles([{ letter: tile.letter, value: tile.value, location: destinationLocation }, ...restOfTiles]);
                }
            },
        });
    }, [tiles]);

    const squares = renderSquares(tiles)
    const rackSquares = renderRackSquares(tiles)
    return (
        <>
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