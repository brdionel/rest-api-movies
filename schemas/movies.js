const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "O title deve ser um string",
    required_error: "O title é necessario",
  }),
  year: z.number().int().min(1900).max(2023),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5.5),
  poster: z.string().url({
    message: "O poster deve ser una url",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Crime",
      "Drama",
      "Adventure",
      "Sci-Fi",
      "Romance",
      "Animation",
      "Biography",
      "Fantasy",
    ]),
    {
      required_error: "O genero é requerido porra",
      invalid_type_error: "O genero dev ser un array con los tipos possiveis",
    }
  ),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validateMovie,
  validatePartialMovie,
};
