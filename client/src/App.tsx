import './App.css'
import { Board } from './Board'
import type { TileRecord } from './types'

function App() {

  const initialTiles: TileRecord[] = [
    {
    value: 4,
    letter: 'S',
    location: [5, 3]
},
  {
    value: 4,
    letter: 'H',
    location: [5, 4]
},
  {
      value: 4,
      letter: 'E',
      location: [5, 5]
  },
  {
      value: 4,
      letter: 'L',
      location: [5, 6]
  },
    {
      value: 4,
      letter: 'L',
      location: [5, 7]
  }
]

  return (
    <>
      <Board initialTiles={initialTiles}/>
    </>
  )
}

export default App
