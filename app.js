const express = require('express')
// for ID creation
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:8080'
      ]
      if (ACCEPTED_ORIGINS.includes(origin)) {
        callback(null, true)
      }
      if (!origin) {
        callback(null, true)
      }
    }
  })
)
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/movies', (req, res) => {
  // just for this endpoint
  // const origin = req.header('origin')
  // origin is just sended when the origin is diferent from the original one
  // if (ACCEPTED_ORIGINS.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  // path-to-regex :id
  const { id } = req.params
  const movie = movies.find((i) => i.id === id)
  console.log(movie)
  if (movie) {
    return res.json(movie)
  } else {
    return res.status(404).json({ message: 'movie not found' })
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(404).json({ error: result.error })
  }

  if (result.success) {
    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ...result.data
    }
    // this is just for example purpouses this shouldnt be done
    movies.push(newMovie)
    return res.status(201).json(newMovie)
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  console.log(result)

  if (result.error) {
    return res.status(404).json({ error: result.error })
  }

  if (result.success) {
    const newMovie = {
      id: crypto.randomUUID(), // uuid v4
      ...result.data
    }
    // this is just for example purpouses this shouldnt be done
    movies.concat(newMovie)
    return res.status(201).json(newMovie)
  }
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((i) => i.id === id)
  const result = validatePartialMovie(req.body)
  console.log(result.error)
  if (result.error) {
    return res.status(404).json({ message: JSON.parse(result.error.message) })
  }
  const updateMovie = { ...movies[movieIndex], ...result.data }
  movies[movieIndex] = updateMovie
  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((i) => i.id === id)
  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not Found' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie Deleted' })
})

app.options('/movies', (req, res) => {
  // const origin = req.header('origin')
  // if (ACCEPTED_ORIGINS.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin)
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  //   res.send(200)
  // }
})

const PORT = process.env.PORT ?? 3001

app.listen(PORT, () => {
  console.log(`listening in port http://localhost:${PORT}`)
})
