const http = require('http')
const express = require('express')
const app = express()

app.use(express.json())

let tiles = [
  {
    id: 1,
    letter: 'A',
    value: 1
  },
  {
    id: 2,
    letter: 'A',
    value: 1
  },
  {
    id: 3,
    letter: 'X',
    value: 10
  },
  {
    id: 4,
    letter: 'B',
    value: 3
  }
]

let placedTiles = [
    {
    value: 4,
    letter: 'S',
    location: [8, 6]
},
  {
    value: 4,
    letter: 'H',
    location: [8, 7]
},
  {
      value: 4,
      letter: 'E',
      location: [8, 8]
  },
  {
      value: 4,
      letter: 'L',
      location: [8, 9]
  },
    {
      value: 4,
      letter: 'L',
      location: [8, 10]
  },
]

let rackTiles = [
 {
      id: 3,
      letter: 'X',
      value: 10
    },
     {
      id: 5,
      letter: 'Y',
      value: 7
    }
  ]

let notes = [
  {
    id: "1",
    content: "HTML is super duuper easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
//plan http server 
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

//using express http server
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
