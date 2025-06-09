import type { Coord, TileRecord } from "./types";

export function isEqualCoord(c1: Coord, c2: Coord): boolean {
    return c1[0] === c2[0] && c1[1] === c2[1];
}

export function isCoord(token: unknown): token is Coord {
	return (
		Array.isArray(token) && token.length === 2 && token.every((val) => typeof val === 'number')
	);
}

export type TileType = 'A' | 'B' | 'C' | 'D' | 'E'  | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N'| 'O' | 'P' | 'Q' | 'R'|'S' |'T' |'U' |'V' |'W' |'X' |'Y'| 'Z';
const tileTypes: TileType[] = ['A' , 'B' , 'C' , 'D' , 'E'  , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N', 'O' , 'P' , 'Q' , 'R','S' ,'T' ,'U' ,'V' ,'W' ,'X' ,'Y', 'Z'];

export function isTileType(value: unknown): value is TileType {
	return typeof value === 'string' && tileTypes.includes(value as TileType);
}

export function canMove(
	start: Coord,
	destination: Coord,
	tiles: TileRecord[],
) {
	// const rowDist = Math.abs(start[0] - destination[0]);
	// const colDist = Math.abs(start[1] - destination[1]);

	if (tiles.find((tile) => isEqualCoord(tile.location, destination))) {
		return false;
	}

	return true
}