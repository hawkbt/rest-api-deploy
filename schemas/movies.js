const z = require('zod')

const moviewSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie Title is required.'
  }),
  year: z
    .number()
    .int()
    .positive()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({ message: 'Poster Must be a valid URL' }),
  genre: z.enum('Action', 'Adventure', 'Comedy', 'Horror').array()
})

const validateMovie = (input) => {
  return moviewSchema.safeParse(input)
}

const validatePartialMovie = (input) => {
  return moviewSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
