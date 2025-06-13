import "./App.css";
import { Board } from "./Board";
import type { TileRecord } from "./types";

function App() {
  const initialTiles: TileRecord[] = [
    {
      value: 4,
      letter: "S",
      location: { x: 3, y: 5 },
      fromRack: false,
    },
    {
      value: 4,
      letter: "H",
      location: { x: 4, y: 5 },
      fromRack: false,
    },
    {
      value: 4,
      letter: "E",
      location: { x: 5, y: 5 },
      fromRack: false,
    },
    {
      value: 4,
      letter: "L",
      location: { x: 6, y: 5 },
      fromRack: false,
    },
    {
      value: 4,
      letter: "L",
      location: { x: 7, y: 5 },
      fromRack: false,
    },
    {
      value: 5,
      letter: "P",
      location: { x: 0, y: 10 },
      fromRack: true,
    },
    {
      value: 1,
      letter: "O",
      location: { x: 1, y: 10 },
      fromRack: true,
    },
    {
      value: 4,
      letter: "P",
      location: { x: 2, y: 10 },
      fromRack: true,
    },
  ];

  return (
    <>
      <Board initialTiles={initialTiles} />
    </>
  );
}

export default App;
