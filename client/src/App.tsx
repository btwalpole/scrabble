import './App.css'
import { Board } from './Board'
import type { TileRecord } from './types'

function App() {

  const initialTiles: TileRecord[] = [
    {
    value: 4,
    letter: 'S',
    location: [5, 3],
    fromRack: false
},
  {
    value: 4,
    letter: 'H',
    location: [5, 4],
    fromRack: false
},
  {
      value: 4,
      letter: 'E',
      location: [5, 5],
    fromRack: false
  },
  {
      value: 4,
      letter: 'L',
      location: [5, 6],
    fromRack: false
  },
    {
      value: 4,
      letter: 'L',
      location: [5, 7],
    fromRack: false
  },
    {
      value: 5,
      letter: 'P',
      location: [10, 0],
    fromRack: true
  },
  {
      value: 1,
      letter: 'O',
      location: [10, 1],
    fromRack: true
  },
    {
      value: 4,
      letter: 'P',
      location: [10, 2],
    fromRack: true
  }
]

  return (
    <>
      <Board initialTiles={initialTiles}/>
    </>
  )
}

export default App
