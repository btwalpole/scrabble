export type Coord = { x: number; y: number };

export type TileRecord = {
  letter: string;
  value: number;
  location: Coord;
  fromRack: boolean;
};
